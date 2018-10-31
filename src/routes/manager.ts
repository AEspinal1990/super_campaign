import { Request, Response, Router } from 'express';
import { getManager, getRepository } from 'typeorm';
import { Campaign } from '../backend/entity/Campaign';
import { Canvasser } from '../backend/entity/Canvasser';
import { Assignment } from '../backend/entity/Assignment';
import { Locations } from '../backend/entity/Locations';
import * as fs from 'fs';
import { Task } from '../backend/entity/Task';
import { RemainingLocation } from '../backend/entity/RemainingLocation';
import { RelationCountAttribute } from 'typeorm/query-builder/relation-count/RelationCountAttribute';
import { Results } from '../backend/entity/Results';
import { CompletedLocation } from '../backend/entity/CompletedLocation';

const router: Router = Router();
const isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next()
    } else {
        res.redirect('/');
    }
}
/* FOR OR_TOOLS PYTHON */
// const {spawn} = require('child_process');
// const pyORT = spawn('python', ['../util/ortool.py']);

router.get('/new-assignment/:id', async (req: Request, res: Response) => {
    const campaignID = req.params.id;

    var campaign = await getManager().findOne(Campaign, { where: { "_ID": campaignID } });
    if (campaign === undefined) {
        console.log('not found');
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
    } else {
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
        /////////////////////////////////////
        ///////// relations testing /////////
        /////////////////////////////////////  
        var canvasser = await getManager().findOne(Canvasser, { where: { "_campaign_ID": campaign.ID } });
        var task = new Task();
        canvasser.task = [task];
        task.remainingLocation = new RemainingLocation();
        task.remainingLocation.locations = campaign.locations;
        task.scheduledOn = new Date();
        task.assignment = assignment;
        task.campaignID = Number(campaign.ID);
        task.status = false;
        assignment.tasks = [task];
        campaign.assignment = assignment;
        await getManager().save(assignment);
        await getManager().save(campaign);
        await getManager().save(canvasser);
        var campaig = await getManager().findOne(Campaign,
            { where: { "_ID": campaign.ID }, relations: ["_assignment"] })
        console.log(campaig);
        res.status(200);
    }
});

router.get('/view-assignments', isAuthenticated, async (req: Request, res: Response) => {
    // get campaign id


    // redirect to '/:id/view-assignment/:id'
});

router.get('/view-assignments/:id', isAuthenticated, async (req: Request, res: Response) => {
    // use campaignID to get assignment

    // use assignment to get tasks

    //send to frontend
});

router.get('/:id/results', isAuthenticated, async (req: Request, res: Response) => {
    var campaign = await getManager().findOne(Campaign,
        { where: { "_ID": req.params.id } });
    console.log(campaign);
    /*
        create dummy Results data
    */
    var results = [];
    for (let i in campaign.question) {
        var result = new Results();
        result.campaign = campaign;
        result.answer = true;
        result.answerNumber = Number(i);
        result.rating = 5;
        result.completedLocation = new CompletedLocation();
        result.completedLocation.locations = [campaign.locations[0]];
        await getManager().save(result.completedLocation);
    }
    await getManager().save(results);
    campaign.results = results;
    /*
         End of Dummy Results data
     */

    var resul = await getManager().find(Results,
        {
            where: { "_campaign": campaign },
            relations: ["_completedLocation"]
        });
    console.log(resul);

    if (result === undefined) {
        res.status(404).render("view-results", {
            // undefined values
        });
    } else {
        res.status(200).render("view-results", {
            // actual results values
        });
    }
})

function manhattanDist(coord1: number, coord2: number, coord3: number, coord4: number): number {
    // or we can just use google map geometry api... 
    var R = 3958.755866; // miles
    var t1 = coord1 * Math.PI / 180;
    var t2 = coord3 * Math.PI / 180;
    var t3 = (coord3 - coord1) * Math.PI / 180;
    var t4 = (coord4 - coord2) * Math.PI / 180;

    var a = Math.sin(t3 / 2) * Math.sin(t3 / 2) +
        Math.cos(t1) * Math.cos(t2) *
        Math.sin(t4 / 2) * Math.sin(t4 / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    var d = R * c;
    return d;
}
export { router as managerRouter };