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
import { Canvasser } from '../backend/entity/Canvasser';
import { Task } from '../backend/entity/Task';

const router: Router = Router();
const logger = require('../util/logger');
const managerLogger = logger.getLogger('managerLogger');
const middleware = require('../middleware');
const fs = require('fs');


router.get('/', middleware.isAuthenticated, async (req: Request, res: Response) => {
    res.render('campaignScreen');

});

router.post('/new-assignment/:id', async (req: Request, res: Response) => {

    /**
     * Check if id corressponds to a campaign
     */
    let campaign = await getManager().findOne(Campaign, { where: { "_ID": req.params.id } });
    if (campaign === undefined) {
        return res.status(404).send('Campaign not found');
    }
    // check if the campaign has already started
    var currentDate = new Date();
    if (+campaign.startDate <= +currentDate){
        return res.send("This Campaign has already started. You cannot create a new assignemnt!");
    }

    /**
     * Check if a assignment already exists for this campaign
     */
    var replaced = false;
    let assignment = await managerTools.getOldAssignment(campaign.ID)
        .then(res => {
            return res;
        });
    if (assignment != undefined){
        console.log(assignment)
        // delete all tasks and their relations
        assignment = await managerTools.clearAssignment(assignment);
        replaced = true;
    } else {
        assignment = new Assignment();
    }
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

    // This is causing app to restart
    let newTasks = await managerTools.launchORT(data);

    /**
     * Create tasks and assign campaignID & assignment
     */
    let tasks = managerTools.createTasks(JSON.parse(newTasks).routes, campaign, assignment);

    /**
     * Remove canvassers with no openings in schedule
     */
    // console.log('Before remove busy', canvassers)
    canvassers = managerTools.removeBusy(canvassers);
    var ret = managerTools.assignTasks(canvassers, tasks);
    if (ret.status == 3){
        // no available dates
        canvassers = null;
    } else {
        // all or some tasks are assigned
        canvassers = ret.canvasser;
    }
    console.log("after assignTasks")
    var status = ret.status;
    assignment.tasks = tasks;
    campaign.assignment = assignment;
    /**
     * Save new assignment and update campaign
     */
    if (replaced){
        for (let l in assignment.tasks){
            assignment.tasks[l].assignment = assignment;
        }
        await getManager().save(assignment.tasks)
        console.log("after asignment's tasks saves")
    } else {
        await getManager().save(assignment).then(res => console.log("Assingment Saved"));
        await getManager().save(campaign).then(res => console.log("campaign saved"));
    }
    /**
     * Save canvassers with their assigned task
     */
    if (status != 3){
        console.log("before loadCanvasserCampaigns")
        canvassers = await managerTools.loadCanvasserCampaigns(canvassers);
        await getManager().save(canvassers).then(res => console.log("Canvassers saved"));
    } else {
        return res.send("Warning!!! No canvassers are available to assign task(s) to!");
    }
    if (status == 2){
        // warn: only some tasks were assigned
        return res.send("Warning!!! Not enough canvassers are available to be assigned for all tasks!")
    }

    if (req.user[0]._permission === 1) {
        res.status(200).render('CampaignManagerHome', {campaigns: campaign})
    } 
    else if (req.user[0]._permission === 2) {  
        res.status(200).render('CanvasserHome')
    }
    else {
        res.status(200).render('AdminHome')
    }
});

router.get('/view-assignment/:id', async (req: Request, res: Response) => {

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
        tasks[i].remainingLocations = locations;
        location.forEach(l => {
            l.locations.forEach(place => {
                tasks[i].remainingLocations.push(place);
            })

        })
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
// console.log(canv)
    if (res.status(200)) {
        if (canv === undefined) {
            res.send('Error retreiving task ' + req.body.taskID);
        } else {
            var cindex, index;
            var geocodes = [];
            for (let j in canv) {
                for (let i in canv[j].task) {
                    // console.log(canv[j].task[i].ID + " - " + req.body.taskID)
                    if (canv[j].task[i].ID == req.body.taskID) {
                        // console.log("inside")
                        cindex = j;
                        index = i;
                        for (let h in canv[j].task[i].remainingLocation.locations) {
                            geocodes.push({
                                lat: canv[j].task[i].remainingLocation.locations[h].lat,
                                lng: canv[j].task[i].remainingLocation.locations[h].long
                            });
                        }
                    }
                }
            }

            // console.log(cindex)
            res.render("view-task-detail", {
                task: canv[cindex].task[index],
                canvasserID: req.body.canvasserID,
                geocodes: geocodes
            });
        }
    } else {
        res.status(404).send("Details of Task " + req.body.taskID + " was not found");
    }
});

router.get('/createDummyVaried/:id', async (req: Request, res: Response) => {
    var campaign = await getManager().findOne(Campaign,
        { where: { "_ID": req.params.id } });
    var question = await getManager().find(Questionaire,
        { where: { "_campaign": campaign } });
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
});


router.get('/results/:id', middleware.manages, async (req: Request, res: Response) => {
    var campaign = await getManager().findOne(Campaign,
        { where: { "_ID": req.params.id } });
    

    var resul = await getManager().find(Results, {
            where: { "_campaign": campaign },
            relations: ["_completedLocation", "_completedLocation._locations"]
        });

    if(resul.length === 0 ) {
        return res.render('view-results', {
            empty: true,
            role: req.user[0]._permission,
            resultsTableView: "",
            id: req.params.id,
            resultsSummary: "",
            ratingStatistics: ""
        });
    }
    var question = await getManager().find(Questionaire,
        { where: { "_campaign": campaign } });
    campaign.results = resul;

    console.log('The results', resul)
    function ResultDetails(location_Id, rating, coord) {
        this.location_Id = location_Id;
        this.rating = rating;
        this.coord = coord;
    }

    campaign.locations.forEach(location => {
        new ResultDetails(location.ID, 'results', managerTools.getCoords2(location));
    });
    var ratingResults = await resultStatisticsUtil.getRatingStatistics(req);
    var questionaireResults = await resultStatisticsUtil.getQuestionStatistics(req);

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
            empty: false,
            role: req.user[0]._permission,
            resultsTableView: resultsTable,
            id: req.params.id,
            resultsSummary: questionaireResults,
            ratingStatistics: ratingResults
        });
    }
})



export { router as managerRouter };