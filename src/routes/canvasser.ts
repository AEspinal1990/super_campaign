import { Request, Response, Router }    from 'express';
import { getManager }     from "typeorm";
import { User }           from "../backend/entity/User";
import { Canvasser }      from '../backend/entity/Canvasser'; 
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
        // res.redirect('/login');
        res.redirect('/');
    }
}


/**
 * GET and POST for Edit Availability
 */
router.get('/:id/availability', isAuthenticated, async(req: Request, res: Response) => {
    const canvas = await getManager()
    .createQueryBuilder(Canvasser, "canvasser")
    .leftJoinAndSelect("canvasser._campaigns", "campaign")
    .leftJoinAndSelect("canvasser._ID", "user")
    .leftJoinAndSelect("canvasser._availableDates", "avaDate")
    .leftJoinAndSelect("canvasser._assignedDates", "assDate")
    .where("campaign._ID = :ID", { ID: req.params.id})
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
    .where("campaign._ID = :ID", { ID: req.params.id})
    .getOne();
    console.log(canv);
    //

    adminLogger.info(`/${req.params.id}/availability - Changed availablility`);
    res.send('You want to edit your availablity.');
});

router.post('/:id/availability', isAuthenticated, async(req: Request, res: Response) => {
    
    /**
     * Parse data received into a useable format.
     */
    // here
    const yyyy = "2018";
    const mm = "03";
    const dd = "27";
    const date = `${yyyy} - ${mm} - `
});

router.get('/:id/view-tasks', isAuthenticated, async(req: Request, res: Response) => {
    const canv = await getManager()
    .createQueryBuilder(Canvasser, "canvasser")
    .leftJoinAndSelect("canvasser._campaigns", "campaign")
    .leftJoinAndSelect("campaign._locations", "campLocations")
    .leftJoinAndSelect("canvasser._ID", "user")
    .leftJoinAndSelect("canvasser._availableDates", "avaDate")
    .leftJoinAndSelect("canvasser._assignedDates", "assDate")
    .leftJoinAndSelect("canvasser._results", "results")
    .where("campaign._ID = :ID", { ID: req.params.id})
    .getOne();
    console.log(canv);


    adminLogger.info(`/${req.params.id}/view-tasks - View Tasks`);
    
});

export {router as canvasserRouter}