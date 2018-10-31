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

router.get('/new-assignment/:id', async (req: Request, res: Response) => {
    const campaignID = req.params.id;

    var campaign = await getManager().findOne(Campaign, {where: {"_ID": campaignID}});
    if (campaign === undefined){
        console.log('not found')
        res.status(404);
        // res.status(404).render('create-assignment', {
        //     id: "",
        //     name: "",
        //     manager: "",
        //     assignment: "",
        //     location: "",
        //     sDate: "",
        //     eDate: "",
        //     duration: "",
        //     question: "",
        //     points: "",
        //     canvasser: ""
        // });
    }
    // console.log(campaign);
    var assignment = new Assignment();
    // assignment.campaign = campaign;

   // temp global variables ########
        var AVG_TRAVEL_SPEED = 3; // in MPH
        var WORKDAY_LIMIT = 10; // in hours

   var avgDistance = 0;
    campaign.locations.forEach(e => {
        var avgSingleDistance = 0;
        // find the average distance from all other locations
        campaign.locations.forEach(x => {
            // find avg distance from locations object
            avgSingleDistance += manhattanDist(e.lat, e.long, x.lat, x.long) / AVG_TRAVEL_SPEED;
        });
        avgSingleDistance /= campaign.locations.length;
        avgDistance += avgSingleDistance;
    });
    avgDistance /= campaign.locations.length;
    var numTask = (avgDistance + campaign.avgDuration) / WORKDAY_LIMIT;
    console.log("Create Assignment = number of tasks: ", numTask);
    // relations testing
            
            //find canvavsser
            var canvasser = await getManager().findOne(Canvasser, {where: {"_campaign_ID": campaign.ID}});
            // console.log(canvasser);
            //set up task
            var task = new Task();
            canvasser.task = [task];
            task.remainingLocations = new RemainingLocation();
            task.remainingLocations.locationID = campaign.locations;
            task.scheduledOn = new Date();
            task.assignment = assignment;
            task.campaignID = Number(campaign.ID);
            task.status = false;
            assignment.tasks = [task];
            campaign.assignment = assignment;
            // console.log(task);
            await getManager().save(assignment);
            // console.log(campaign);
            await getManager().save(campaign);
             await getManager().save(canvasser);
            var campaig = await getManager().findOne(Campaign,
                {where: {"_ID": campaign.ID}, relations: ["_assignment"]})
            console.log(campaig);
        res.status(200);
});

function manhattanDist(coord1:number, coord2:number, coord3:number, coord4:number):number{
    // or we can just use google map geometry api... 
    var R = 3958.755866; // miles
    var t1 = coord1 * Math.PI / 180;
    var t2 = coord3 * Math.PI / 180;
    var t3 = (coord3-coord1) * Math.PI / 180;
    var t4 = (coord4-coord2) * Math.PI / 180;
    
    var a = Math.sin(t3/2) * Math.sin(t3/2) +
            Math.cos(t1) * Math.cos(t2) *
            Math.sin(t4/2) * Math.sin(t4/2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    
    var d = R * c;
    return d;
}
export { router as managerRouter };