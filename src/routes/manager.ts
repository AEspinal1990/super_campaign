import { Request, Response, Router }    from 'express';
import { getManager }                   from 'typeorm';
import { Campaign }                     from '../backend/entity/Campaign';
import { Assignment }                   from '../backend/entity/Assignment';
import { Results }                      from '../backend/entity/Results';
import { CompletedLocation }            from '../backend/entity/CompletedLocation';
import { Questionaire }                 from '../backend/entity/Questionaire';
import * as managerTools                from '../util/managerTools';

const router: Router = Router();
const winston   = require('winston');
const logger    = require('../util/logger');
const managerLogger = winston.loggers.get('managerLogger');


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
     * Canvassers for this campaign
     * Locations to canvass
     */
    let canvassers = await managerTools.getAvailableCanvassers(req.params.id);
    let locations = managerTools.getCampaignLocations(campaign);

    /**
     * Generate an estimate of the number of task needed to canvass each location
     * Used for estimate needed by OR-Tools
     */
    let numTask = managerTools.estimateTask(locations, campaign.avgDuration, AVG_TRAVEL_SPEED, WORKDAY_LIMIT);
    console.log("Create Assignment = number of tasks: ", numTask);

    /**
     * Create tasks
     */
    let tasks = managerTools.generateTasks(locations, campaign.avgDuration, AVG_TRAVEL_SPEED, WORKDAY_LIMIT);
    
    // let result;
    // let coord1 = managerTools.getCoords(locations[0]);
    // let coord2 =  managerTools.getCoords(locations[1]);
    // await googleMapsClient.directions({
    //     origin: coord1, 
    //     destination: coord2
    // })
    // .asPromise()
    // .then(res => result = res)
    // .catch(e => console.log(e));
    // console.log(result.json.routes[0].legs[0].duration);
    res.status(200).send('Create Assignment');

    // /////////////////////////////////////
    // ///////// relations testing /////////
    // /////////////////////////////////////  
    // let canvasser = await getManager().findOne(Canvasser, { where: { "_campaign_ID": campaign.ID } });
    // let task = new Task();
    // canvasser.task = [task];
    // task.remainingLocation = new RemainingLocation();
    // task.remainingLocation.locations = campaign.locations;
    // task.scheduledOn = new Date();
    // task.assignment = assignment;
    // task.campaignID = Number(campaign.ID);
    // task.status = false;
    // assignment.tasks = [task];
    // campaign.assignment = assignment;
    // await getManager().save(assignment);
    // await getManager().save(campaign);
    // await getManager().save(canvasser);
    // let campaig = await getManager().findOne(Campaign,
    //     { where: { "_ID": campaign.ID }, relations: ["_assignment"] })
    // console.log(campaig);
    
});

router.get('/view-assignments', isAuthenticated, async (req: Request, res: Response) => {
    // get campaign id


    // redirect to '/:id/view-assignment/:id'
});

router.get('/view-assignments/:id', isAuthenticated, async (req: Request, res: Response) => {
    // use campaignID to get assignment

    // use assignment to get tasks

    //send to frontend
});

router.get('/createdummyresult', async (req: Request, res: Response) => {
    var campaign = await getManager().findOne(Campaign,
        { where: { "_ID": req.params.id }});
    var question = await getManager().find(Questionaire,
        {where: {"_campaign": campaign}});
    /*
        create dummy Results data
    */
    var results = [];
    for (var i=0;i<question.length;i++) {
        var result = new Results();
        result.campaign = campaign;
        result.answer = true;
        result.answerNumber = Number(i);
        result.rating = 5;
        result.completedLocation = new CompletedLocation();
        result.completedLocation.locations = [campaign.locations[0]];
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
    /*
        create dummy Results data
    */
    // var results = [];
    // for (var i=0;i<question.length;i++) {
    //     var result = new Results();
    //     result.campaign = campaign;
    //     result.answer = true;
    //     result.answerNumber = Number(i);
    //     result.rating = 5;
    //     result.completedLocation = new CompletedLocation();
    //     result.completedLocation.locations = [campaign.locations[0]];
    //     console
    //     await getManager().save(result.completedLocation);
    //     results.push(result);
    // }
    // await getManager().save(results);
    // campaign.results = results;
    // console.log(results);
    /*
         End of Dummy Results data
     */

    var resul = await getManager().find(Results,
    {
        where: { "_campaign": campaign },
        relations: ["_completedLocation"]
    });
    console.log(resul);

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

    console.log(campaign.locations)
    console.log(coords)
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