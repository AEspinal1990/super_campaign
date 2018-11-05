import { Request, Response, Router }    from 'express';
import { getManager, getRepository }    from "typeorm";
import { Canvasser }                    from '../backend/entity/Canvasser';
import { Availability }                 from '../backend/entity/Availability';
import { io }                           from '../server';

const router: Router = Router();
const middleware = require('../middleware');
const winston = require('winston');
const logger = require('../util/logger');
const canvasserLogger = winston.loggers.get('canvasserLogger');

router.get('/calendar',middleware.isAuthenticated, async (req: Request, res: Response) => {
    res.render('edit-availability');

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
    for (let avail in canvas.availableDates) {
        let curDate = new Date(canvas.availableDates[avail].availableDate);
        let curDateStr = "" + curDate.getMonth() + "/" + curDate.getDate() + "/" + curDate.getFullYear() + ",";
        availableOrAssigned += curDateStr;
    }
    //Remove the las comma added on previous loop
    if (availableOrAssigned !== "") {
        availableOrAssigned = availableOrAssigned.slice(0, -1);
    }
    for (let avail in canvas.assignedDates) {
        let curDate = new Date(canvas.assignedDates[avail].assignedDate);
        let curDateStr = "," + curDate.getMonth() + "/" + curDate.getDate() + "/" + curDate.getFullYear();
        availableOrAssigned += curDateStr;
    }
    // if available dates is empty, then the first comma is not needed in the second for loop
    if (canvas.availableDates == []) {
        availableOrAssigned = availableOrAssigned.slice(1);
    }

    res.render('edit-availability', {availableOrAssigned, canvasserID});    
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

    /*
        Handling edited AssignedDates
            Approach: Create new assignments when dates for assignedDate(s) are edited
            Cons:   -Lots of overhead (a lot of calls to database and run of algorithm) 
                    -Possible issues when intergrating concurrency
            Pros:   -Easy to implement
    ====================================================================================
    // delete all assignedDates for all canvassers in campaign
    
    // redirect to create assignment

    */

    await getManager().save(canv);
    //redirect after finish posting
    canvasserLogger.info(`Editted availability for canvasser: ${req.params.id}`);

    res.send("Done Editing Availability");
});

router.get('/:id/view-tasks', middleware.isCanvasser, async (req: Request, res: Response) => {
    const canv = await getManager()
        .createQueryBuilder(Canvasser, "canvasser")
        .leftJoinAndSelect("canvasser._task", "task")
        .leftJoinAndSelect("canvasser._campaigns", "campaign")
        .leftJoinAndSelect("canvasser._ID", "user")
        .where("campaign._ID = :ID", { ID: req.params.id })
        .getOne();
    // check when a canvaseer is in many campaigns. check the list of campaigns

    /*
        Make dummy task data
    */
    // console.log("starting dummy");
    // var task = new Task();
    // task.ID = 2;
    // task.campaignID = 1;
    // task.status = false;
    // task.scheduledOn = new Date();
    // var rml = new RemainingLocation();
    // rml.ID = 2;
    // task.remainingLocation = rml;
    // rml.task = task;
    // rml.locations = [await getManager().findOne(Locations, {
    //     where: {"_ID": 2}
    // })];
    // console.log(rml);
    // task.completedLocation = new CompletedLocation();
    // canv.task.push(task);
    // rml.ID = 2;
    // await getManager().save(canv);
    // await getManager().save(rml);
    // await getManager().save(canv);

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

router.post('/view-task-detail', middleware.isCanvasser, async (req: Request, res: Response) => {
    // console.log(req.body);
    const canv = await getManager()
        .createQueryBuilder(Canvasser, "canvasser")
        // .leftJoinAndSelect("canvasser._ID", "user")
        .leftJoinAndSelect("canvasser._campaigns", "campaign")
        // .leftJoinAndSelect("canvasser._results", "results")
        .leftJoinAndSelect("canvasser._task", "task")
        .leftJoinAndSelect("task._remainingLocation", "rmL")
        .leftJoinAndSelect("rmL._locations", "fmLs")
        .where("campaign._ID = :ID", { ID:  req.body.campaignID})
        .getOne();
        // console.log(canv)
    if (res.status(200)) {
        if (canv === undefined) {
            res.send('Error retreiving task ' + req.body.taskID);
        } else {
            var index;
            var geocodes = [];
            // console.log(req.body.taskID)
            for (let i in canv.task) {
                if (canv.task[i].ID == req.body.taskID) {
                    index = Number(i);
                }
            }
            // console.log(canv.task)
            for (let i in canv.task[index].remainingLocation.locations) {
                geocodes.push({
                    lat: canv.task[index].remainingLocation.locations[i].lat,
                    lng: canv.task[index].remainingLocation.locations[i].long
                });
            }
            // console.log(geocodes);
            // console.log(canv.task[index]);
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

export { router as canvasserRouter }