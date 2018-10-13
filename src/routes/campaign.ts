import { Request, Response, Router } from 'express';
import { createConnection, getConnection } from 'typeorm';
import { Campaign } from '../backend/entity/Campaign';

const router: Router = Router();

const typeorm_1 = require("typeorm");
const User_1 = require("../backend/entity/User");
const Canvasser_1 = require("../backend/entity/Canvasser");
const Campaign_1 = require("../backend/entity/Campaign");
const CampaignManager_1 = require("../backend/entity/CampaignManager");
const Assignment_1 = require("../backend/entity/Assignment");
const Task_1 = require("../backend/entity/Task");
const RemainingLocation_1 = require("../backend/entity/RemainingLocation");
const Locations_1 = require("../backend/entity/Locations");
const CompletedLocation_1 = require("../backend/entity/CompletedLocation");
const Results_1 = require("../backend/entity/Results");
const Questionaire_1 = require("../backend/entity/Questionaire");
const TalkPoint_1 = require("../backend/entity/TalkPoint");
const Availability_1 = require("../backend/entity/Availability");
const AssignedDate_1 = require("../backend/entity/AssignedDate");

router
    /**
     * GET/ POST for create Campaign
     */
    .get('/new', async(req: Request, res: Response) =>{
        res.render('create-campaign');
    })
    
    .post('/', async(req: Request, res: Response)=>{
        let campaignName = req.body.campaign.campaignName;
        //make date object for mysql
        let startDate = req.body.campaign.startDate;
        let endDate = req.body.campaign.endDate;
        let talkingPoints = req.body.campaign.talkingPoints;
        //seperate questions and place them in table with primary key being the question and the campaign ID
        let questionaire = req.body.campaign.questionaire;
        let averageExpectedDuration = req.body.campaign.averageExpectedDuration;
        //parse location by lines
        let locations = req.body.camapign.locations;
        //store somehow in a different table?
        let canvassers = req.body.campaign.canvassers;

        const newCampaign = new Campaign_1.Campaign();
        newCampaign.name = "campaign1";
        newCampaign.manager = [];
        // campaign1.canvasser = [canvasser1];
        newCampaign.startDate = new Date();
        newCampaign.endDate = new Date();
        newCampaign.avgDuration = 1;
        newCampaign.locations;
        //yield connection.manager.save(campaign1);


        console.log(req.body.campaign);
        res.status(200).send('Done');
    })

    /**
     * GET for view campaign
     */
    .get('/:id/view', async(req: Request, res: Response) => {

    let { campaignID } = req.params;
    console.log("before connection");
    createConnection().then(async connection => {
        const campaign = await getConnection()
            .createQueryBuilder()
            .select("campaign")
            .from(Campaign, "campaign")
            .getOne()
            .then((camp) =>{
                console.log(camp);
            })
            .catch(e => {
                console.log('Oh shit',e)
            })
        console.log("after connection");
        // res.render('view_campaign', {});
        res.send('hold');
    }).catch(e => console.log(e));
    
    // createConnection().then(async connection => {
    //     const campaign = await connection.manager.findOne(Campaign, req.params);
    //     // res.render{'view_campaign', {campaign}};
    //     res.send(campaign.name);
    // });
});

export {router as campaignRouter}
