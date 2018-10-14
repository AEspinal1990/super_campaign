import { Request, Response, Router } from 'express';
import { createConnection, getConnection } from 'typeorm';
import { Campaign } from '../backend/entity/Campaign';

import * as createCampaign from '../util/createCampaign';

const router: Router = Router();
router
    /**
     * GET/ POST for create Campaign
     */
    .get('/new', async(req: Request, res: Response) =>{
        res.render('create-campaign');
    })
    
    .post('/', async(req: Request, res: Response)=>{
        createCampaign.createCampaign(req.body.campaign);
        res.status(200).redirect('/user/new'); //remember to change
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
