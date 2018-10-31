import { Request, Response, Router } from 'express';
import { getManager, getRepository } from 'typeorm';
import { Campaign } from '../backend/entity/Campaign';
import { Canvasser } from '../backend/entity/Canvasser';
import { Assignment } from '../backend/entity/Assignment';
import { Locations } from '../backend/entity/Locations';
import * as fs from 'fs';
import { Task } from '../backend/entity/Task';
import { RemainingLocation } from '../backend/entity/RemainingLocation';

const router: Router = Router();

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
    /*
        foreach (1:location){
            avgTravelTime += l.location.distance / avgTravelSpeed {~===1.4 meters/sec or 3.1 mph}
        }
        avgTrabelTime /= numLocations;
        numTask = (avgTravelTime + AVG_VISIT_TIME) / WORKDAY_LIMIT;
    */
   // temp global variables ########
        var AVG_TRAVEL_SPEED = 3;
        var WORKDAY_LIMIT = 10;

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

    // relations testing
            
            //find canvavsser
            var canvasser = await getManager().findOne(Canvasser, {where: {"_campaign_ID": campaign.ID}});
            console.log(canvasser);
            //set up task
            var task = new Task();
            assignment.tasks = [task];
            canvasser.task = [task];
            task.remainingLocations = [new RemainingLocation()];
            task.remainingLocations[0].locationID = campaign.locations;
            task.scheduledOn = new Date();

            // should save task and remainingLocation entities and canvasser
            // await getManager().save(canvasser);
            await getManager().save(assignment);
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