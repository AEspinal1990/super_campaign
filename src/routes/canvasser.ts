import { Request, Response, Router } from 'express';
import { getManager, getRepository } from "typeorm";
import { Canvasser } from '../backend/entity/Canvasser';
import { Availability } from '../backend/entity/Availability';
import { io } from '../server';
import { Campaign } from '../backend/entity/Campaign';
import { Questionaire } from '../backend/entity/Questionaire';
import { TalkPoint } from '../backend/entity/TalkPoint';
import { Assignment } from '../backend/entity/Assignment';
import { Task } from '../backend/entity/Task';
import { Results } from '../backend/entity/Results';
import { CompletedLocation } from '../backend/entity/CompletedLocation';
import { Locations } from '../backend/entity/Locations';

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
router.get('/availability/:id', middleware.isCanvasser, async (req: Request, res: Response) => {
    let canvasserID = req.params.id;
    const canvas = await getManager()
        .createQueryBuilder(Canvasser, "canvasser")
        .leftJoinAndSelect("canvasser._ID", "user")
        .leftJoinAndSelect("canvasser._availableDates", "avaDate")
        .leftJoinAndSelect("canvasser._assignedDates", "assDate")
        .where("canvasser._ID = :ID", { ID: canvasserID })
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

router.post('/availability/:id', middleware.isCanvasser, async (req: Request, res: Response) => {
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
        .where("canvasser._ID = :ID", { ID: req.params.id })
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
    canvasserLogger.info(`Editted availability for canvasser with id: ${req.params.id}`);

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
        .where("user._employeeID = :id", {id: req.user[0]._employeeID})
        .getOne();
// console.log(canvasser)
    var tasks = [];
    for (let l in canvasser.campaigns){
        var task = [];
        for (let m in canvasser.task){
            if (canvasser.campaigns[l].ID === canvasser.task[m].campaignID){
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
    // router.get('/canvassing/:campaignID/:taskID', async (req: Request, res: Response) => {
    var task = await getManager()
        .createQueryBuilder(Task, "task")
        .leftJoinAndSelect("task._remainingLocation", "RL")
        .leftJoinAndSelect("RL._locations", "RLocations")
        .leftJoinAndSelect("task._completedLocation", "CL")
        .leftJoinAndSelect("CL._locations", "CLocations")
        .where("task._ID = :id", {id: req.body.taskID})
        .getOne();

    // create a list of talking points withou the campaign object
    var talkingPoints = await getManager().find(TalkPoint, {where: {"_campaign": req.body.campaignID}});
    var points = [];
    talkingPoints.forEach(tp => {
        points.push(tp.talk);
    });
   
    var route = [];
    for (let l in task.remainingLocation.locations){
        route.push({
            lat: task.remainingLocation.locations[l].lat,
            lng: task.remainingLocation.locations[l].long
        });
    }
    io.on('connection', function (socket) {
        socket.emit('route', route);
    });
    
    res.render("canvassing-map", {
    // res.send({
        task: task,
        talkingPoints: points 
     });
    // use google directions api in frontend: https://developers.google.com/maps/documentation/javascript/directions
    // only show route from point a to b where a is current location and b is next destination
});

/**
 * For entering results of a location
 * THIS CAN BE PART OF THE ROUTE 'canvassing/map' IT IS UP TO FRONTEND
 */
router.post('/canvassing/enter-results', async (req: Request, res: Response) => {
    // create a list of questions without the campaign object
    var questionaire = await getManager().find(Questionaire, {where: {"_campaign": req.body.campaignID}});
    var questions = [];
    questionaire.forEach(q => {
        questions.push(q.question);
    });

    res.render("canvassing-enter-results", {
    // res.send({
        questions: questions,
    })
});

/**
 * For saving the results
 */
router.post('/canvassing/results', async (req: Request, res: Response) => {
// router.get('/canvassing/results/:campaignID', async (req: Request, res: Response) => {
    var results = req.body.results;
    var rating = req.body.rating;
    var completedLocation = new CompletedLocation();
    completedLocation.locations = [req.body.completedLocation];
    
    var campaign = await getManager()
        .createQueryBuilder(Campaign, "campaign")
        .where("campaign._ID = :id", {id: req.params.campaignID})
        .getOne();

    campaign.results = await getManager().find(Results, {where: { "_campaign": campaign }});

    completedLocation.results = [];
    for (let l in results){
        var result = new Results();
        result.answerNumber = Number(l);
        result.answer = results[l];
        result.rating = rating;
        result.campaign = campaign;
        completedLocation.results.push(result);
    }

    await getManager().save(completedLocation)
        .then(res => console.log("saved completedLocation"))
        .catch(e => console.log(e));
    
    // add campaign reference to results
    completedLocation.results.forEach(re => {
        re.completedLocation = completedLocation;
    });
    await getManager().save(completedLocation.results)
        .then(res => console.log("saved results"))
        .catch(e => console.log(e));

    // remove the circular references - NOT NECESSARY
    completedLocation.results.forEach(re => {
        re.completedLocation = undefined;
    });

    // go to success message and redirect to '/canvassing/map'
    res.send(campaign);
});

export { router as canvasserRouter }