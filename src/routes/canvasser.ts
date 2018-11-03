import { Request, Response, Router } from 'express';
import { getManager, getRepository } from "typeorm";
import { User } from "../backend/entity/User";
import { Canvasser } from '../backend/entity/Canvasser';
import { Availability } from '../backend/entity/Availability';
import { Results } from '..//backend/entity/Results';
import { CompletedLocation } from '../backend/entity/CompletedLocation';
import { managerRouter } from './manager';
import { io } from '../server';
import { Task } from '../backend/entity/Task';
import { RemainingLocation } from '../backend/entity/RemainingLocation';
import { Locations } from '../backend/entity/Locations';

const router: Router = Router();

const winston = require('winston');
const logger = require('../util/logger');
const adminLogger = winston.loggers.get('canvasserLogger');

const isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next()
    } else {
        res.redirect('/');
    }
}

router.get('/calendar', async (req: Request, res: Response) => {
    res.render('edit-availability');

});

/**
 * GET and POST for Edit Availability
 */
router.get('/availability/:id', isAuthenticated, async (req: Request, res: Response) => {
    const canvas = await getManager()
        .createQueryBuilder(Canvasser, "canvasser")
        .leftJoinAndSelect("canvasser._ID", "user")
        .leftJoinAndSelect("canvasser._availableDates", "avaDate")
        .leftJoinAndSelect("canvasser._assignedDates", "assDate")
        .where("canvasser._ID = :ID", { ID: req.params.id })
        .getOne();
    console.log(canvas);
    if (canvas == undefined) {
        res.send("Wrong Link (Canvasser ID)");
    } else {
        adminLogger.info(`/availability/${req.params.id} - Changed availablility`);
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
        //res.send('You want to edit your availablity.');
        res.render('edit-availability', {
            availableOrAssigned: availableOrAssigned,
            canvasserID: req.params.id
        });
    }
});

router.post('/availability/:id', isAuthenticated, async (req: Request, res: Response) => {
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
});

router.get('/:id/view-tasks', isAuthenticated, async (req: Request, res: Response) => {
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
    // task.ID = 1;
    // task.campaignID = 1;
    // task.status = false;
    // task.scheduledOn = new Date();
    // var rml = new RemainingLocation();
    // rml.ID = 1;
    // task.remainingLocation = rml;
    // rml.task = task;
    // rml.locations = [await getManager().findOne(Locations)];
    // console.log(rml);
    // task.completedLocation = new CompletedLocation();
    // canv.task.push(task);
    // rml.ID = 1;
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

    adminLogger.info(`/${req.params.id}/view-tasks - View Tasks`);
});

router.post('/view-task-detail', isAuthenticated, async (req: Request, res: Response) => {
    // console.log(req.body.campaignID);
    const canv = await getManager()
        .createQueryBuilder(Canvasser, "canvasser")
        .leftJoinAndSelect("canvasser._campaigns", "campaign")
        .leftJoinAndSelect("canvasser._results", "results")
        .leftJoinAndSelect("canvasser._task", "task")
        .leftJoinAndSelect("task._remainingLocation", "rmL")
        .leftJoinAndSelect("rmL._locations", "fmLs")
        .where("campaign._ID = :ID", { ID:  req.body.campaignID})
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
            for (let i in canv.task[index].remainingLocation) {
                geocodes.push({
                    lat: canv.task[index].remainingLocation[i].lat,
                    lng: canv.task[index].remainingLocation[i].long
                });
            }
            io.on('connection', function (socket) {
                socket.emit('task-geocodes', geocodes);
            });

            res.render("view-task-detail", {
                task: canv.task[index]
            });
        }
    } else {
        res.status(404).send("Details of Task " + req.body.taskID + " was not found");
    }
});

export { router as canvasserRouter }