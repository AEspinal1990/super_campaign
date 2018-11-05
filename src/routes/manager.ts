import { Request, Response, Router } from 'express';
import { getManager } from 'typeorm';
import { Campaign } from '../backend/entity/Campaign';
import { Assignment } from '../backend/entity/Assignment';
import { Results } from '../backend/entity/Results';
import { CompletedLocation } from '../backend/entity/CompletedLocation';
import { Questionaire } from '../backend/entity/Questionaire';
import * as managerTools from '../util/managerTools';
import * as resultStatisticsUtil from '../util/resultStatisticsUtil';
import { io } from '../server';
import { Task } from '../backend/entity/Task';
import { RemainingLocation } from '../backend/entity/RemainingLocation';

const router: Router = Router();
const winston = require('winston');
const logger = require('../util/logger');
const managerLogger = winston.loggers.get('managerLogger');
const middleware = require('../middleware');



/* FOR OR_TOOLS PYTHON */
// const {spawn} = require('child_process');
// const pyORT = spawn('python', ['../util/ortool.py']);
router.post('/new-assignment/:id', middleware.manages, async (req: Request, res: Response) => {

    /**
     * Check if id corressponds to a campaign
     */
    let campaign = await getManager().findOne(Campaign, { where: { "_ID": req.params.id } });
    if (campaign === undefined) {
        return res.status(404).send('Campaign not found');
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
    tasks.forEach(async task => {
        task.assignment = assignment;
        // await getManager().save(task);   
    });

    /**
     * Create Assignment from the generated Tasks
     */
    assignment.tasks = tasks;


    /**
     * Assign new Assignment to the campaign
     */
    campaign.assignment = assignment;
    
    /**
     * Remove canvassers with no openings in schedule
     */
    canvassers = managerTools.removeBusy(canvassers);

    /**
     * Assign tasks
     */
    canvassers = managerTools.assignTasks(canvassers, tasks);

    /**
     * Save new assignment and update campaign
     */
    await getManager().save(assignment)
        .then(res => managerLogger.info(`Successfully created an assignment for campaign: ${campaign.name}`))
        .catch(e => managerLogger.error(`An error occured while saving the assignment for campaign: ${e}`));
    await getManager().save(campaign)
        .then(res => managerLogger.info(`Successfully updated ${campaign.name} with its new assignment`))
        .catch(e => managerLogger.error(`An error occured while updating ${e} with its new assignment`));

    /**
     * Save canvassers with their assigned task
     */
    canvassers.forEach(async canvasser => {
        await getManager().save(canvasser)
            .then(res => managerLogger.info(`Assigned a task to ${canvasser.ID} `))
            .catch(e => managerLogger.error(`An error occured while assigning a task to  ${e}`))
    });

    res.status(200).send('Create Assignment');

});

router.get('/view-task/:id', middleware.manages, async (req: Request, res: Response) => {
    // get campaign id
    let tempId = 6;
    let locations = [];
    var geocodes = [];
        
    // Query for task
    let task = await getManager().findOne(Task, { where: { "_ID": tempId } });
   
    // Grab remaining Locations and insert locations into an array
    let remainingLocation = await getManager().findOne(RemainingLocation, { where: { "_ID": task.ID } });
    if(remainingLocation !== undefined) {
        remainingLocation.locations.forEach(location => locations.push(location));
    }
    
    // Grab completed Locations and insert locations into an array
    let completedLocation = await getManager().findOne(CompletedLocation, { where: { "_ID": task.ID } });
    if( completedLocation !== undefined) {
        completedLocation.locations.forEach(location => locations.push(location));
    }

    // Grab geocodes
    locations.forEach(location => {
        geocodes.push({
            lat: location.lat,
            long: location.long,
        })
    })

    
    res.send([task.ID, JSON.stringify(locations), JSON.stringify(geocodes)])
});

router.get('/view-assignment/:id', middleware.manages, async (req: Request, res: Response) => {

    let campaign;
    let tasks = [];
    let remainingLocations = [];
    let locations = [];
    let taskLocations = [];
    let campaignID = req.params.id;
    let numLocations = 0;
    let canvassers = [];

    // Check if id corressponds to a campaign    
    campaign = await getManager().findOne(Campaign, { where: { "_ID": campaignID } });
    if (campaign === undefined) {
        return res.status(404).send('Assignment not found')
    }

    // Grab all canvassers that work for this campaign
    canvassers = await managerTools.getCanvassers(campaignID);

    // Grab all task with this campaign id
    tasks = await managerTools.getCampaignTask(campaignID);
    let test = [];
    // Grab all remaining locations for the tasks
    for (let i in tasks) {
        let location = await managerTools.getRemainingLocations(tasks[i].ID);
        //console.log(i, location)
        tasks[i].remainingLocations = locations;
        location.forEach(l => {
            //console.log(i, l.locations.length)
            l.locations.forEach(place => {
                //console.log(place)
                tasks[i].remainingLocations.push(place);
            })
            
        })
        //console.log(i, tasks[i].remainingLocations.length)
        tasks[i].duration = 15
        tasks[i].numLocations = tasks[i].remainingLocations.length;
        remainingLocations.push(location);
        test.push(location);
    }
 

    // Remove canvassers with no task
    for(let i = 0; i < canvassers.length; i++) {
        if(canvassers[i]._task === undefined) {
            canvassers.splice(i,1);
        }
    }

    // Map canvassers to task - Will fix don't judge its 6:25am
    // For each task
    tasks.forEach(task => {

        // Look in every canvasser
        canvassers.forEach(canvasser => {

            // Go through all their task
            let t = canvasser._task;
            t.forEach(canvasser_task => {
                
                // And find if this task is once of theirs
                if(Number(canvasser_task._ID) === Number(task._ID)) {
                    // found match insert this canvasser into task 
                    task.canvasser = canvasser._ID._username;
                }
            })
        })
    });
    

    // Get all the locations in remainingLocations
    for (let i in remainingLocations) {
        for (let j in remainingLocations[i]) {
            remainingLocations[i][j].locations.forEach(location => {
                //console.log(location)
                locations.push(location)
                numLocations++;
            });
        }
        // Each iteration is one task.
        // Limit 1 element to 1 task.
        taskLocations.push(locations);
        locations = [];
    }

    // Calculate the duration of each task
    tasks.forEach(task => {
        //console.log(task.remainingLocations)
        task = managerTools.findDuration(task, campaign);
    })
    
    let id = 2;
    res.render('view-tasks', { tasks, campaignID, id, numLocations })
});

router.get('/createdummyresult/:id', async (req: Request, res: Response) => {
    var campaign = await getManager().findOne(Campaign,
        { where: { "_ID": req.params.id } });
    var question = await getManager().find(Questionaire,
        { where: { "_campaign": campaign } });
    /*
        create dummy Results data
    */
    
    for (let j in campaign.locations) { // delete this loop for only 1 completed location
        var results = [];
        var completed = new CompletedLocation();
        completed.locations = [];
        for (var i = 0; i < question.length; i++) {
            var result = new Results();
            result.campaign = campaign;
            result.answer = true;
            result.answerNumber = Number(i);
            result.rating = 5;
            result.completedLocation = completed;
            result.completedLocation.locations.push(campaign.locations[j]);
            await getManager().save(result.completedLocation);
            results.push(result);
        }
        await getManager().save(results);
    }
    res.send('ITs done');
});
router.get('/createDummyVaried/:id', async (req: Request, res: Response) => {
    var campaign = await getManager().findOne(Campaign,
        { where: { "_ID": req.params.id } });
    var question = await getManager().find(Questionaire,
        { where: { "_campaign": campaign } });
    /*
        create dummy Results data
    */
   function randomIntFromInterval(min,max) // min and max included
   {
       return Math.floor(Math.random()*(max-min+1)+min);
   }

    for (let j in campaign.locations) { // delete this loop for only 1 completed location
        var results = [];
        var completed = new CompletedLocation();
        completed.locations = [];
        for (var i = 0; i < question.length; i++) {
            var result = new Results();
            result.campaign = campaign;
            if(randomIntFromInterval(1,2) == 1) {
                result.answer = false;
            } else {
                result.answer = true;
            }            result.answerNumber = Number(i);
            result.rating = randomIntFromInterval(1,5);
            result.completedLocation = completed;
            result.completedLocation.locations.push(campaign.locations[j]);
            await getManager().save(result.completedLocation);
            results.push(result);
        }
        await getManager().save(results);
    }
    res.send('ITs done');
});


router.get('/results/:id', middleware.manages, async (req: Request, res: Response) => {
    var campaign = await getManager().findOne(Campaign,
        { where: { "_ID": req.params.id } });
    var question = await getManager().find(Questionaire,
        { where: { "_campaign": campaign } });

    var resul = await getManager().find(Results,
        {
            where: { "_campaign": campaign },
            relations: ["_completedLocation", "_completedLocation._locations"]
        });
    campaign.results = resul;

    function ResultDetails(location_Id, rating, coord) {
        this.location_Id = location_Id;
        this.rating = rating;
        this.coord = coord;
    }

    campaign.locations.forEach(location => {
        new ResultDetails(location.ID, 'results', managerTools.getCoords2(location));
        //coords.push(managerTools.getCoords2(location));
    });

    resultStatisticsUtil.getStatistics(req);
    //console.log(campaign.getLocationsResults()[1].completedLocation._locations[0]._lat);

    //send all the locations results through the socket
    io.on('connection', function (socket) {
        socket.emit('result-details', campaign.getLocationsResults());
    });

    if (resul === undefined) {
        res.status(404).send("No results were found for this campaign.");
    } else {
        res.render('view-results', {
            resultsTableView: resul,
            id: req.params.id
        });
    }
})



export { router as managerRouter };