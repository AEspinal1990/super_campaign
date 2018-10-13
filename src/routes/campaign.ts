import { Request, Response, Router } from 'express';
import { createConnection, getConnection } from 'typeorm';
import { Campaign } from '../backend/entity/Campaign';

const router: Router = Router();


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
