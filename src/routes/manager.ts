import { Request, Response, Router }    from 'express';
import { getManager }                   from 'typeorm';
import { Campaign }                     from '../backend/entity/Campaign';
import { Assignment }                   from '../backend/entity/Assignment';
import { Results }                      from '../backend/entity/Results';
import { CompletedLocation }            from '../backend/entity/CompletedLocation';
import { Questionaire }                 from '../backend/entity/Questionaire';
import * as managerTools                from '../util/managerTools';
import { RemainingLocation }    from '../backend/entity/RemainingLocation';
import { Task }                 from '../backend/entity/Task';

const router: Router = Router();
const winston   = require('winston');
const logger    = require('../util/logger');
const managerLogger = winston.loggers.get('managerLogger');
const middleware = require('../middleware');

const isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next()
    } else {
        res.redirect('/');
    }
}

/* FOR OR_TOOLS PYTHON */
// const {spawn} = require('child_process');
// const pyORT = spawn('python', ['../util/ortool.py']);

router.post('/new-assignment/:id', async (req: Request, res: Response) => {

    /**
     * Check if id corressponds to a campaign
     */
    let campaign = await getManager().findOne(Campaign, { where: { "_ID": req.params.id } });    
    if (campaign === undefined) {
        console.log('not found');
        return res.status(404).render('create-assignment', {
            id: "",
            name: "",
            manager: "",
            assignment: "",
            location: "",
            sDate: "",
            eDate: "",
            duration: "",
            question: "",
            points: "",
            canvasser: ""
        });
    } 
        
    /**
     * Create Assignment
     */
    let assignment = new Assignment();

    /**
     * Grab global parameters from globals.json
     */
    let AVG_TRAVEL_SPEED = managerTools.getAvgSpeed();    
    let WORKDAY_LIMIT = managerTools.getWorkdayLimit(); 

    /**
     * Grab necessary data to create an assignment.
     * Canvassers to put to work
     * Locations to canvass
     */
    let canvassers = await managerTools.getAvailableCanvassers(req.params.id);
    let locations = managerTools.getCampaignLocations(campaign);

    /**
     * Generate an estimate of the number of task needed to canvass each location
     * Used for estimate needed by OR-Tools
     */
    let numTask = managerTools.estimateTask(locations, campaign.avgDuration, AVG_TRAVEL_SPEED, WORKDAY_LIMIT);

    /**
     * Create tasks
     */
    let tasks = await managerTools.generateTasks(locations, campaign.avgDuration, AVG_TRAVEL_SPEED, WORKDAY_LIMIT);
    tasks.forEach(task => {
        task = managerTools.decorateTask(task, campaign);  
    });

    /**
     * Associate each task with an assignment
     */
    tasks.forEach(task => task.assignment = assignment);

    /**
     * Create Assignment from the generated Tasks
     */
    assignment.tasks = tasks;
    

    /**
     * Assign new Assignment to the campaign
     */
    campaign.assignment = assignment;

    /**
     * Save new assignment and update campaign
     */
    await getManager().save(assignment)
        .then(res => console.log('Successfully created an assignment'))
        .catch(e => console.log('Assignment Error: ', e));
    await getManager().save(campaign)
        .then(res => console.log('Successfully updated campaign with a new assignment'))
        .catch(e => console.log('Campaign Update Error: ', e));

    // /////////////////////////////////////
    // ///////// relations testing /////////
    // /////////////////////////////////////  
    // //canvasser.task = [task];
   
    // //await getManager().save(canvasser);
    
    res.status(200).send('Create Assignment');

});

router.get('/view-assignments', isAuthenticated, async (req: Request, res: Response) => {
    // get campaign id
    

    // redirect to '/:id/view-assignment/:id'
});

router.get('/view-assignment/:id', isAuthenticated, async (req: Request, res: Response) => {
    
    /**
     * Check if id corressponds to a campaign
     */
    let campaign = await getManager().findOne(Campaign, { where: { "_ID": req.params.id } });    
    if (campaign === undefined) {
        console.log('not found');
        return res.status(404).render('create-assignment', {
            id: "",
            name: "",
            manager: "",
            assignment: "",
            location: "",
            sDate: "",
            eDate: "",
            duration: "",
            question: "",
            points: "",
            canvasser: ""
        });
    }

    // Grab all task with this campaign id
    let tasks = await managerTools.getCampaignTask(campaign.ID);
    
    // Grab all remaining locations for the tasks
    let remainingLocations = await managerTools.getRemainingLocations(tasks[1].ID)
    console.log(remainingLocations);
    // Grab all completed locations for the tasks

    //send to frontend
    // For each task
        // canvasser
        // Locations with its coordinates
        // number of locations
        // Duration of task

    
    res.send('OK')
});

router.get('/createdummyresult/:id', async (req: Request, res: Response) => {
    var campaign = await getManager().findOne(Campaign,
        { where: { "_ID": req.params.id }});
    var question = await getManager().find(Questionaire,
        {where: {"_campaign": campaign}});
    /*
        create dummy Results data
    */
    var results = [];
    var completed = new CompletedLocation();
    completed.locations = [];
    for (var i=0;i<question.length;i++) {
        var result = new Results();
        result.campaign = campaign;
        result.answer = true;
        result.answerNumber = Number(i);
        result.rating = 5;
        result.completedLocation = completed;
        result.completedLocation.locations.push(campaign.locations[0]);
        await getManager().save(result.completedLocation);
        results.push(result);
    }
    await getManager().save(results);
    res.send('ITs done');
});


router.get('/results/:id', isAuthenticated, async (req: Request, res: Response) => {
    var campaign = await getManager().findOne(Campaign,
        { where: { "_ID": req.params.id }});
    var question = await getManager().find(Questionaire,
        {where: {"_campaign": campaign}});

    var resul = await getManager().find(Results,
    {
        where: { "_campaign": campaign },
        relations: ["_completedLocation", "_completedLocation._locations"]
    });
    console.log(resul);
    campaign.results = resul;
    console.log(campaign.getLocationsResults());

    function ResultDetails (location_Id, rating, coord) {
        this.location_Id = location_Id;
        this.rating = rating;
        this.coord = coord
    }
    let coords = []
    campaign.locations.forEach( location => {
        new ResultDetails (location.ID, 'results', managerTools.getCoords2(location));
        //coords.push(managerTools.getCoords2(location));
    });

    // console.log(campaign.locations)
    // console.log(coords)
    if (resul === undefined) {
        res.status(404).send("No results were found for this campaign.");
    } else {
        // res.status(200).render("view-results", {
        //     result: resul
        // });
        res.render('view-results', {
            resultsTableView: resul,
            id: req.params.id
        })
    }
})



export { router as managerRouter };