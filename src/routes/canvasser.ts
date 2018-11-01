import { Request, Response, Router } from 'express';
import { getManager, getRepository } from "typeorm";
import { User } from "../backend/entity/User";
import { Canvasser } from '../backend/entity/Canvasser';
import { Availability } from '../backend/entity/Availability';
import { Results } from '..//backend/entity/Results';
import { CompletedLocation } from '../backend/entity/CompletedLocation';

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

/**
 * GET and POST for Edit Availability
 */
router.get('/:id/availability', isAuthenticated, async (req: Request, res: Response) => {
    const canvas = await getManager()
        .createQueryBuilder(Canvasser, "canvasser")
        .leftJoinAndSelect("canvasser._campaigns", "campaign")
        .leftJoinAndSelect("canvasser._ID", "user")
        .leftJoinAndSelect("canvasser._availableDates", "avaDate")
        .leftJoinAndSelect("canvasser._assignedDates", "assDate")
        .where("campaign._ID = :ID", { ID: req.params.id })
        .getOne();
    console.log(canvas);

    // relations testing //
    var avail = new Availability();
    avail.availableDate = new Date();
    canvas.availableDates = [avail];
    await getManager().save(avail);
    console.log("After availability save");
    await getManager().save(canvas);
    const canv = await getManager()
        .createQueryBuilder(Canvasser, "canvasser")
        .leftJoinAndSelect("canvasser._campaigns", "campaign")
        .leftJoinAndSelect("canvasser._ID", "user")
        .leftJoinAndSelect("canvasser._availableDates", "avaDate")
        .leftJoinAndSelect("canvasser._assignedDates", "assDate")
        .where("campaign._ID = :ID", { ID: req.params.id })
        .getOne();
    console.log(canv);
    //

    // send dates to frontend
    // res.render("", {canv.availableDates});
    
    adminLogger.info(`/${req.params.id}/availability - Changed availablility`);
    res.send('You want to edit your availablity.');
});

router.post('/:id/availability', isAuthenticated, async (req: Request, res: Response) => {
    //get data 
    var newDates = [];
    /**
     * Parse data received into a useable format.
     */
    const yyyy = "2018";
    const mm = "03";
    const dd = "27";
    const date = `${yyyy} - ${mm} - ${dd}`

    const canv = await getManager()
        .createQueryBuilder(Canvasser, "canvasser")
        .leftJoinAndSelect("canvasser._campaigns", "campaign")
        .leftJoinAndSelect("canvasser._ID", "user")
        .leftJoinAndSelect("canvasser._availableDates", "avaDate")
        .leftJoinAndSelect("canvasser._assignedDates", "assDate")
        .where("campaign._ID = :ID", { ID: req.params.id })
        .getOne();
    // copy canvasser's old available dates
    var availCopy = [];
    for (let i in canv.availableDates){
        availCopy.push(canv.availableDates.splice(0,1));
    }
    // copy canvasser's new available dates
    canv.availableDates = [];
    for (let i in newDates){
        var avail = new Availability();
        avail.availableDate = new Date(
            newDates[i][0], newDates[i][1], newDates[i][2]);
        canv.availableDates.push(avail);
    }
    // delete old available dates that are unused
    for (let i in availCopy){
        for (let j in canv.availableDates){
            if (availCopy[i] === canv.availableDates[j]){
                canv.availableDates[j].ID = availCopy[i].ID;
                break;
            }
            if (Number(j) === canv.availableDates.length-1){
                await getRepository(Availability)
                    .createQueryBuilder()
                    .delete()
                    .where("_ID = :ID", {ID: availCopy[i].ID})
                    .execute();
            }
        }
    }
});

router.get('/:id/view-tasks', isAuthenticated, async (req: Request, res: Response) => {
    const canv = await getManager()
        .createQueryBuilder(Canvasser, "canvasser")
        .leftJoinAndSelect("canvasser._campaigns", "campaign")
        .leftJoinAndSelect("campaign._locations", "campLocations")
        .leftJoinAndSelect("canvasser._ID", "user")
        .leftJoinAndSelect("canvasser._availableDates", "avaDate")
        .leftJoinAndSelect("canvasser._assignedDates", "assDate")
        .leftJoinAndSelect("canvasser._results", "results")
        .leftJoinAndSelect("canvasser._task", "task")
        .where("campaign._ID = :ID", { ID: req.params.id })
        .getOne();
    console.log(canv);

    // make some checks?


    if (canv === undefined) {
        res.send('You have no tasks assigned.');
    } else {
        res.render("view-tasks", {
            // send canvasser's tasks
        });
    }
    if (res.status(200))
        res.send("Available Date Updated.");
    else
        res.send("Error updating available dates");

    adminLogger.info(`/${req.params.id}/view-tasks - View Tasks`);

});

export { router as canvasserRouter }