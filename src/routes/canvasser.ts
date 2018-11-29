import { Request, Response, Router } from 'express';
import { getManager, getRepository } from "typeorm";
import { Canvasser } from '../backend/entity/Canvasser';
import { Availability } from '../backend/entity/Availability';
import { io } from '../server';
import { Campaign } from '../backend/entity/Campaign';
import { Questionaire } from '../backend/entity/Questionaire';
import { Results } from '../backend/entity/Results';
import { CompletedLocation } from '../backend/entity/CompletedLocation';
import { Locations } from '../backend/entity/Locations';
import { getTalk, fillResults, removeLocation, sendToMap, findTask, getTasksByCampaign, getTaskByID, fillCampaign, getResults } from '../util/canvasserTools';
import { Task } from '../backend/entity/Task';
import { Result } from 'range-parser';

const router: Router = Router();
const middleware = require('../middleware');
const logger = require('../util/logger');
const canvasserLogger = logger.getLogger('canvasserLogger');

router.get('/calendar', middleware.isAuthenticated, async (req: Request, res: Response) => {
    res.render('edit-availability');

});

router.get('/', middleware.isAuthenticated, async (req: Request, res: Response) => {
    res.render('canvasserScreen');

});

/**
 * GET and POST for Edit Availability
 */
router.get('/availability', async (req: Request, res: Response) => {
    let canvasserID = req.params.id;
    const canvas = await getManager()
        .createQueryBuilder(Canvasser, "canvasser")
        .leftJoinAndSelect("canvasser._ID", "user")
        .leftJoinAndSelect("canvasser._availableDates", "avaDate")
        .leftJoinAndSelect("canvasser._assignedDates", "assDate")
        .where("canvasser._ID = :ID", { ID: req.user[0]._employeeID })
        .getOne();
    if (canvas == undefined) {
        return res.send("Wrong Link (Canvasser ID)");
    }

    //combine available and assigned dates to be shown on calendar
    var availableOrAssigned = "";
    var assigned = "";
    for (let avail in canvas.availableDates) {
        let curDate = new Date(canvas.availableDates[avail].availableDate);
        let curDateStr = curDate.getMonth() + "/" + curDate.getDate() + "/" + curDate.getFullYear() + ",";
        availableOrAssigned += curDateStr;
    }
    for (let avail in canvas.assignedDates) {
        let curDate = new Date(canvas.assignedDates[avail].assignedDate);
        let curDateStr = curDate.getMonth() + "/" + curDate.getDate() + "/" + curDate.getFullYear() + ",";
        availableOrAssigned += curDateStr;
        assigned += curDateStr;
    }
    if (availableOrAssigned !== "") {
        availableOrAssigned = availableOrAssigned.slice(0, -1);
    }
    if (assigned !== "") {
        assigned = assigned.slice(0, -1);
    }
    
    res.render('edit-availability', { availableOrAssigned, canvasserID, assigned });
});

// { dates:
//     [ Node]       '11/04/2018,11/05/2018,11/06/2018,11/07/2018,11/08/2018,11/09/2018,11/15/2018,11/22/2018,11/29/2018,11/28/2018,11/30/2018,11/21/2018,11/24/2018,11/23/2018,11/16/2018,11/14/2018' } }

router.post('/availability', async (req: Request, res: Response) => {
    //new dates passed in from frontend
    if (req.body.editAvailability.dates === '') {
        return;
    }
    var newDates = req.body.editAvailability.dates.split(",");
    const canv = await getManager()
        .createQueryBuilder(Canvasser, "canvasser")
        .leftJoinAndSelect("canvasser._ID", "user")
        .leftJoinAndSelect("canvasser._campaigns", "campaigns")
        .leftJoinAndSelect("canvasser._availableDates", "avaDate")
        .leftJoinAndSelect("canvasser._assignedDates", "assDate")
        .where("canvasser._ID = :ID", { ID: req.user[0]._employeeID })
        .getOne();
    // copy canvasser's old available dates
    var availCopy = [];
    while (canv.availableDates.length > 0) {
        availCopy.push(canv.availableDates.splice(0, 1)[0]);
    }
    // copy canvasser's new available dates
    canv.availableDates = [];
    for (let i in newDates) {
        var avail = new Availability();
        let newDateParts = newDates[i].split("/");
        if (newDateParts != null) {
            avail.availableDate = new Date(
                newDateParts[2], newDateParts[0], newDateParts[1]);
            canv.availableDates.push(avail);
        }
    }
    // we can assume that canvassers cannot change availability if assigned
    // however leaving this logic just in case
    /**     Handling edited available dates for tasks
     * if a tasked date is removed
     *      if edited dates are still within campaign start&end dates
     *          assign a new date the task
     *      else
     *          delete assignedDates for tasked-canvassers in campaign
     *          re direst to new assignment
    */

    // delete old available dates that are unused
    for (let i in availCopy) {
        for (let j in canv.availableDates) {
            if (+availCopy[i].availableDate === +canv.availableDates[j].availableDate) {
                canv.availableDates[j].ID = availCopy[i].ID;
                break;
            }
            if (Number(j) === canv.availableDates.length - 1) {
                await getRepository(Availability)
                    .createQueryBuilder()
                    .delete()
                    .where("_ID = :ID", { ID: availCopy[i].ID })
                    .execute();
            }
        }
    }

    await getManager().save(canv);
    //redirect after finish posting
    canvasserLogger.info(`Editted availability for canvasser with id: ${req.user[0]._employeeID}`);

    res.send("Done Editing Availability");
});

router.get('/:id/view-tasks', async (req: Request, res: Response) => {
    const canv = await getManager()
        .createQueryBuilder(Canvasser, "canvasser")
        .leftJoinAndSelect("canvasser._task", "task")
        .leftJoinAndSelect("canvasser._campaigns", "campaign")
        .leftJoinAndSelect("canvasser._ID", "user")
        .where("user._employeeID = :ID", { ID: req.user[0]._employeeID })
        .getOne();
    // check when a canvaseer is in many campaigns. check the list of campaigns

    if (canv === undefined) {
        res.send('You have no tasks assigned.');
    } else {
        res.render("view-tasks", {
            tasks: canv.task,
            id: canv.ID.employeeID,
            campaignID: req.params.id
        });
    }

    canvasserLogger.info(`/${req.params.id}/view-tasks - View Tasks`);
});

router.post('/view-task-detail', async (req: Request, res: Response) => {
    const canv = await getManager()
        .createQueryBuilder(Canvasser, "canvasser")
        // .leftJoinAndSelect("canvasser._ID", "user")
        .leftJoinAndSelect("canvasser._campaigns", "campaign")
        // .leftJoinAndSelect("canvasser._results", "results")
        .leftJoinAndSelect("canvasser._task", "task")
        .leftJoinAndSelect("task._remainingLocation", "rmL")
        .leftJoinAndSelect("rmL._locations", "fmLs")
        .where("campaign._ID = :ID", { ID: req.body.campaignID })
        .getOne();
    if (res.status(200)) {
        if (canv === undefined) {
            res.send('Error retreiving task ' + req.body.taskID);
        } else {
            var index;
            var geocodes = [];
            for (let i in canv.task) {
                if (canv.task[i].ID == req.body.taskID) {
                    index = Number(i);
                }
            }
            for (let i in canv.task[index].remainingLocation.locations) {
                geocodes.push({
                    lat: canv.task[index].remainingLocation.locations[i].lat,
                    lng: canv.task[index].remainingLocation.locations[i].long
                });
            }
            io.on('connection', function (socket) {
                socket.emit('task-geocodes', geocodes);
            });

            res.render("view-task-detail", {
                task: canv.task[index],
                canvasserID: req.body.canvasserID
            });
        }
    } else {
        res.status(404).send("Details of Task " + req.body.taskID + " was not found");
    }
});

/**
 * Start of canvassing where user selects a campaign -> task -> real time canvassing
 */
router.get('/canvassing', async (req: Request, res: Response) => {
    var canvasser = await getManager()
        .createQueryBuilder(Canvasser, "canvasser")
        .leftJoinAndSelect("canvasser._ID", "user")
        .leftJoinAndSelect("canvasser._campaigns", "campaigns")
        .leftJoinAndSelect("canvasser._task", "task")
        .where("user._employeeID = :id", { id: req.user[0]._employeeID })
        .getOne();
    // console.log(canvasser)
    var tasks = [];
    for (let l in canvasser.campaigns) {
        var task = [];
        for (let m in canvasser.task) {
            if (canvasser.campaigns[l].ID === canvasser.task[m].campaignID) {
                task.push(canvasser.task[m]);
            }
        }
        tasks.push(task);
    }
    // console.log(tasks)
    res.render("canvassing", {
        // res.send({
        campaigns: canvasser.campaigns,
        tasks: tasks
    });
});

/**
 * Real time canvassing where route is shown on map, 
 * along with talking points, questionaire, and option for entering results
 */
router.post('/canvassing/map', async (req: Request, res: Response) => {
    var task = await getTaskByID(req.body.taskID);
    // create a list of talking points withou the campaign object
    var talkingPoints = await getTalk(req.body.campaignID);
    var points = [];
    talkingPoints.forEach(tp => {
        points.push(tp.talk);
    });

    var task = await getTaskByID(req.body.taskID);
    // console.log('The task:', task);
    sendToMap(task, req.body.campaignID);

    res.render("canvassing-map", {
        // res.send({
        task: task,
        talkingPoints: points,
    });
});

/**
 * For entering results of a location
 */
router.post('/canvassing/enter-results', async (req: Request, res: Response) => {
    // create a list of questions without the campaign object
    var questionaire = await getManager().find(Questionaire, { where: { "_campaign": req.body.campaignID } });
    var questions = [];
    questionaire.forEach(q => {
        questions.push(q.question);
    });
    // console.log(req.body.taskID)
    res.render("canvassing-enter-results", {
        // res.send({
        questions: questions,
        campaignID: req.body.campaignID,
        locationID: req.body.locationID,
        taskID: req.body.taskID
    })
});

/**
 * For saving the results
 */
router.post('/canvassing/results', async (req: Request, res: Response) => {
    var results = req.body.results;
    var rating = req.body.rating;
    var completedLocation = new CompletedLocation();

    completedLocation.locations = [await getManager().findOne(Locations, { where: { "_ID": req.body.locationID } })];
    var campaign = await getManager().findOne(Campaign, { where: { "_ID": req.body.campaignID } });
    campaign.results = await getManager().find(Results, { where: { "_campaign": campaign.ID } });

    // delete this location from remaining locations
    var tasks = await getTasksByCampaign(req.body.campaignID);
    var task = await findTask(tasks, req.body.locationID);
    console.log("before removelocation task: ",task)
    var location = removeLocation(task.remainingLocation.locations, req.body.locationID);

    // save the remainingLocation without this completed location
    await getManager().save(task.remainingLocation)
        .then(res => console.log("after remaining locations save"))
        .catch(e => console.log(e));

    /** 
     * Check if there is a existing completed location in the task and adjust accordingly
     * add the new results and new location to the completed location
     */
    var pushed = false;
    if (task.completedLocation == undefined || task.completedLocation == null) {
        task.completedLocation = completedLocation;
        console.log("before task save CL: ", completedLocation)
        // Re-load the task with a new completed location ID
        await getManager().save(task)
            .then(res => console.log("after task save"))
            .catch(e => console.log(e));
        task = await getTaskByID(task.ID);
        // console.log(task)
        // fill the new results
        completedLocation.results = fillResults(results, rating, campaign, null);
    } else {
        task.completedLocation.locations.push(location);
        pushed = true;

        // fill the new and old results
        var oldRes = await getResults(task, campaign.ID).then(res => {
            return res;
        });
        
        completedLocation.results = fillResults(results, rating, campaign, oldRes);
    }

    console.log(task)
    completedLocation.ID = task.completedLocation.ID;

    // await getManager().save(completedLocation)
    //     .then(res => console.log("saved completed location"))
    //     .catch(e => console.log(e));

    // assign the completed location for every results
    for (let l in completedLocation.results) {
        completedLocation.results[l].completedLocation = completedLocation;
    }

    // save the results
    await getManager().save(completedLocation.results)
        .then(res => console.log("saved results"))
        .catch(e => console.log(e));

    // await getManager().save(completedLocation)
    //     .then(res => console.log("after completed location"));

    await getTaskByID(req.body.taskID)
        .then(res => sendToMap(res, req.body.campaignID));

    // go to success message and redirect to '/canvassing/map'
    res.render("canvassing-return-map", {
        taskID: req.body.taskID,
        campaignID: req.body.campaignID
    });
});

router.get("/test-task-save/:id", async (req:Request, res:Response) => {
    var task = await getTaskByID(req.params.id);
    console.log(task)
    //@ts-ignore
    task.completedLocation.locations.push(await getManager().findOne(Locations, {where: {"_ID": 4}}));
    var result = await getResults(task, 1);
    console.log(result)
    //@ts-ignore
    await getManager().save(task.completedLocation).then(res => console.log("after CL save"));
    await getManager().save(result).then(res => console.log("after result save"));
    // //@ts-ignore
    // task.completedLocation.results = [result];
    // //@ts-ignore
    // task.completedLocation = CL;
    // await getManager().save(task);
    res.send("done");
});


export { router as canvasserRouter }