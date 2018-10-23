import { Request, Response, Router } from 'express';
import { getManager, getRepository } from 'typeorm';
import { Campaign } from '../backend/entity/Campaign';
import { Canvasser } from '../backend/entity/Canvasser';
import { Assignment } from '../backend/entity/Assignment';
import { Locations } from '../backend/entity/Locations';
import * as fs from 'fs';
import { Task } from '../backend/entity/Task';
import { RemainingLocation } from '../backend/entity/RemainingLocation';

const { createLogger, format, transports } = require('winston');
const router: Router = Router();
const path = require('path');
const env = process.env.NODE_ENV || 'development';
const logDir = 'log';

// Create the log directory if it does not exist
if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir);
}
const filename = path.join(logDir, 'manager.log');
const logger = createLogger({
    // change level if in dev environment versus production
    level: env === 'development' ? 'debug' : 'info',
    format: format.combine(
        format.timestamp({
            format: 'YYYY-MM-DD HH:mm:ss'
        }),
        format.printf(info => `${info.timestamp} ${info.level}: ${info.message}`)
    ),
    transports: [
        new transports.Console({
            level: 'info',
            format: format.combine(
                format.colorize(),
                format.printf(
                    info => `${info.timestamp} ${info.level}: ${info.message}`
                )
            )
        }),
        new transports.File({ filename })
    ]
});
const isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next()
    } else {
        res.redirect('/');
    }
}

router.get('/new_assignment/:id', async (req: Request, res: Response) => {
    const campaignID = req.params.id;

    var campaign = await getManager().findOne(Campaign, {where: {"_ID": campaignID}});
    if (campaign === undefined || campaign.assignment === undefined){
        console.log('not found')
        res.status(404).render('create-assignment', {
            id: "",
            name: "",
            manager: "",
            assignment: "",
            location: "",
            sDate: "",
            eDate: "",
            duration: "",
            question: "",
            points: "",
            canvasser: ""
        });
    }

    var avgTravelTime = 0;
    var assignment = new Assignment();
    assignment.campaign = campaign;

    campaign.locations.forEach(e => {
        campaign.locations.forEach(x => {
            // find avg distance from locations object

        });
    });

    // relations testing
            
            //find canvavsser
            var canvasser = await getManager().findOne(Canvasser, {where: {"_campaign_ID": campaign.ID}});
            console.log(canvasser);
            //set up task
            var task = new Task();
            assignment.tasks = [task];
            canvasser.task = [task];
            task.remainingLocations = new RemainingLocation();
            task.remainingLocations.locationID = campaign.locations;
            task.scheduledOn = new Date();

            // should save task and remainingLocation entities and canvasser
            // await getManager().save(canvasser);
            await getManager().save(assignment);
});

export { router as managerRouter };