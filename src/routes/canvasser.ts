import { Request, Response, Router }    from 'express';
import { getManager }     from "typeorm";
import { User }           from "../backend/entity/User";
import { Canvasser }      from '../backend/entity/Canvasser'; 
import { Availability } from '../backend/entity/Availability';

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
    .leftJoinAndSelect("canvasser._campaignID", "campaign")
    .leftJoinAndSelect("canvasser._ID", "user")
    .leftJoinAndSelect("canvasser._availableDate", "avaDate")
    .leftJoinAndSelect("canvasser._assignedDate", "assDate")
    .where("campaign._ID = :ID", { ID: req.params.id})
    .getMany();
    console.log(canvas);

    // do some stuff
    var avail = new Availability();
    avail.availableDate = new Date();
    canvas[0].availableDate = [avail];
    await getManager().save(avail);
    console.log("After availability save");
    await getManager().save(canvas[0]);
    const canv = await getManager()
    .createQueryBuilder(Canvasser, "canvasser")
    .leftJoinAndSelect("canvasser._campaignID", "campaign")
    .leftJoinAndSelect("canvasser._ID", "user")
    .leftJoinAndSelect("canvasser._availableDate", "avaDate")
    .leftJoinAndSelect("canvasser._assignedDate", "assDate")
    .where("campaign._ID = :ID", { ID: req.params.id})
    .getMany();
    console.log(canv);
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

export {router as canvasserRouter}