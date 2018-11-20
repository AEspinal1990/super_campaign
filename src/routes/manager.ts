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
import { Canvasser } from '../backend/entity/Canvasser';
import { ENGINE_METHOD_NONE } from 'constants';

const router: Router = Router();
const winston = require('winston');
const logger = require('../util/logger');
const managerLogger = winston.loggers.get('managerLogger');
const middleware = require('../middleware');
const fs = require('fs');


router.post('/new-assignment/:id', async (req: Request, res: Response) => {

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
    let ESTIMATED_VISIT_TIME = campaign.avgDuration;

    /**
     * Grab necessary data to create an assignment.
     * Canvassers to put to work
     * Locations to canvass
     * Estimated number of tasks
     */
    let canvassers = await managerTools.getAvailableCanvassers(req.params.id);
    let locations = managerTools.getCampaignLocations(campaign);
    let estimatedTasks = managerTools.estimateTask(locations, ESTIMATED_VISIT_TIME, AVG_TRAVEL_SPEED, WORKDAY_LIMIT);

    // Set up json object
    var data = {
        locations: locations,
        num_canvassers: estimatedTasks,
        estimated_visit_time: ESTIMATED_VISIT_TIME,
        workday_limit: WORKDAY_LIMIT,
        avg_travel_speed: AVG_TRAVEL_SPEED
    };

    let newTasks = await managerTools.launchORT(data);
    /**
     * Create tasks and assign campaignID & assignment
     */
    let tasks = managerTools.createTasks(JSON.parse(newTasks).routes, campaign, assignment);

    /**
     * Remove canvassers with no openings in schedule
     */
    canvassers = managerTools.removeBusy(canvassers);
    canvassers = managerTools.assignTasks(canvassers, tasks);
    assignment.tasks = tasks;
    campaign.assignment = assignment;

    /**
     * Save new assignment and update campaign
     */
    // await getManager().save(assignment);
    // await getManager().save(campaign)
    await getManager()
        .createQueryBuilder()
        .insert()
        .into(Assignment)
        .values(assignment)
        .execute()
        .then(res => managerLogger.info(`Successfully created an assignment for campaign: ${campaign.name}`))
        .catch(e => managerLogger.error(`An error occured while saving the assignment for campaign: ${e}`));

    // await getManager()
    //     .createQueryBuilder()
    //     .update(Campaign)
    //     .set({ _assignment: assignment })
    //     .where("ID = :id", { id: campaign.ID })
    //     .execute()
    //     .then(res => managerLogger.info(`Successfully updated ${campaign.name} with its new assignment`))
    //     .catch(e => managerLogger.error(`An error occured while updating ${e} with its new assignment`));

    console.log("after campaign save")
    /**
     * Save canvassers with their assigned task
     */
    for (let l in canvassers) {
        console.log("before a canvasser save")
        await getManager()
            .createQueryBuilder()
            .relation(Canvasser, "_ID")
            .of(canvassers[l].ID)
            .set(canvassers[l].task)
            .then(res => console.log("Canvasser saved"))
            .catch(e => console.error(e));
        // await getManager().save(canvassers[l]);
        console.log("after a canvasser save")
    }
    // works on local server
    // await getManager().save(canvassers);
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
    if (remainingLocation !== undefined) {
        remainingLocation.locations.forEach(location => locations.push(location));
    }

    // Grab completed Locations and insert locations into an array
    let completedLocation = await getManager().findOne(CompletedLocation, { where: { "_ID": task.ID } });
    if (completedLocation !== undefined) {
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
        remainingLocations.push(location);
        test.push(location);
    }

    // Remove canvassers with no task
    for (let i = 0; i < canvassers.length; i++) {
        if (canvassers[i]._task === undefined) {
            canvassers.splice(i, 1);
        }
    }

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

    let id = 2;
    res.render('view-assignments', { tasks, campaignID, id, numLocations })
});

router.post('/view-assignment-detail', async (req: Request, res: Response) => {
    const canv = await getManager()
        .createQueryBuilder(Canvasser, "canvasser")
        .leftJoinAndSelect("canvasser._campaigns", "campaign")
        .leftJoinAndSelect("canvasser._task", "task")
        .leftJoinAndSelect("task._remainingLocation", "rmL")
        .leftJoinAndSelect("rmL._locations", "fmLs")
        .where("campaign._ID = :ID", { ID: req.body.campaignID })
        .getMany();

    if (res.status(200)) {
        if (canv === undefined) {
            res.send('Error retreiving task ' + req.body.taskID);
        } else {
            var cindex, index;
            var geocodes = [];
            console.log("taskID", req.body.taskID)
            for (let j in canv) {
                for (let i in canv[j].task) {
                    if (canv[j].task[i].ID == req.body.taskID) {
                        cindex = j;
                        index = i;
                        for (let h in canv[j].task[i].remainingLocation.locations) {
                            console.log(i)
                            geocodes.push({
                                lat: canv[j].task[i].remainingLocation.locations[h].lat,
                                lng: canv[j].task[i].remainingLocation.locations[h].long
                            });
                        }
                    }
                }
            }

            io.on('connection', function (socket) {
                socket.emit('assignment-geocodes', geocodes);
            });

            res.render("view-task-detail", {
                task: canv[cindex].task[index],
                canvasserID: req.body.canvasserID
            });
        }
    } else {
        res.status(404).send("Details of Task " + req.body.taskID + " was not found");
    }
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
    function randomIntFromInterval(min, max) // min and max included
    {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    for (let j in campaign.locations) { // delete this loop for only 1 completed location
        var results = [];
        var completed = new CompletedLocation();
        completed.locations = [];
        for (var i = 0; i < question.length; i++) {
            var result = new Results();
            result.campaign = campaign;
            if (randomIntFromInterval(1, 2) == 1) {
                result.answer = false;
            } else {
                result.answer = true;
            } result.answerNumber = Number(i);
            result.rating = randomIntFromInterval(1, 5);
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
    var ratingResults = await resultStatisticsUtil.getRatingStatistics(req);
    var questionaireResults = await resultStatisticsUtil.getQuestionStatistics(req);
    //console.log(campaign.getLocationsResults()[1].completedLocation._locations[0]._lat);
    console.log(questionaireResults);
    //send all the locations results through the socket
    io.on('connection', function (socket) {
        socket.emit('result-details', campaign.getLocationsResults());
    });

    var question = await getManager().find(Questionaire,
        { where: { "_campaign": campaign } });
    var resultsTable = [];
    //loop through resul to convert the IDs to their actual values into resultsTable
    for (var i = 0; i < resul.length; i++) {
        var resultRow = { answer: true, question: "", rating: 0, location: "" };
        resultRow.location = resul[i].completedLocation.locations[0].number + ", " +
            resul[i].completedLocation.locations[0].street + ", " +
            resul[i].completedLocation.locations[0].unit + ", " +
            resul[i].completedLocation.locations[0].city + ", " +
            resul[i].completedLocation.locations[0].state + ", " +
            resul[i].completedLocation.locations[0].zipcode;
        resultRow.question = question[resul[i].answerNumber].question;
        resultRow.answer = resul[i].answer;
        resultRow.rating = resul[i].rating;
        resultsTable.push(resultRow);
    }

    if (resul === undefined) {
        res.status(404).send("No results were found for this campaign.");
    } else {
        res.render('view-results', {
            resultsTableView: resultsTable,
            id: req.params.id,
            resultsSummary: questionaireResults,
            ratingStatistics: ratingResults
        });
    }
})



export { router as managerRouter };