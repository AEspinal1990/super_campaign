import { Request, Response, Router } from 'express';
import { createConnection, getConnection } from 'typeorm';
import { Campaign } from '../backend/entity/Campaign';

import * as campaignCreator from '../util/campaignCreator';

const router: Router = Router();
    /**
     * GET and POST for create Campaign
     */
    router.get('/new', async(req: Request, res: Response) =>{
        res.render('create-campaign');
    });
    
    router.post('/', async(req: Request, res: Response)=>{
        /** let newCampaignObject = createCampaign.createCampaign(req.body.campaign);
        createCampaign.createQuestionaires(req.body.campaign, newCampaignObject);
        createCampaign.createLocations(req.body.campaign, newCampaignObject);
        */
       campaignCreator.createCampaign(req.body.campaign);
        if (res.status(200))
            res.send("Campaign Created!");
        else
            res.send("Error!");
    });

    /**
     * GET and POST for edit Campaign
     */
    router.get('/:id/edit', async(req: Request, res: Response) => {
        res.render('edit-campaign')
    });
    router.post('/', async(req: Request, res: Response) => {

    });

    /**
     * GET for view campaign
     */
    router.get('/:id/view', async(req: Request, res: Response) => {

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
        res.render('view_campaign', {campaign: "campaign.json"});
        
        // res.send('hold');
    }).catch(e => console.log(e));

    // createConnection().then(async connection => {
    //     const campaign = await connection.manager.findOne(Campaign, req.params);
    //     // res.render{'view_campaign', {campaign}};
    //     res.send(campaign.name);
    // });
    });

export {router as campaignRouter}
