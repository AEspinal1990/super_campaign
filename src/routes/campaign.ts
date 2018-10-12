import { Request, Response, Router } from 'express';
import { request } from 'http';
import { Resolver } from 'dns';
import { Any, createConnection, getConnection } from 'typeorm';
import { Campaign } from '../backend/entity/Campaign';

const router: Router = Router();

export const createCampaignGET = (req: Request, res: Response) => {
    res.render('test');
}

export const createCampaignPOST = (req: Request, res: Response) => {
    // console.log(req.body.campaign);
    let campaignName = req.body.campaign.name;
    console.log(campaignName);
    res.status(200).send('Done');
}

router.get('/:id/view', async(req: Request, res: Response) => {

    let { campaignID } = req.params;
    console.log("before connection");
    // try {
    //     const campaign = await getConnection()
    //         .createQueryBuilder()
    //         .select("campaign")
    //         .from(Campaign, "campaign")
    //         .where("campaign.ID = :ID", { ID: campaignID})
    //         .getOne();    
    //     console.log("after connection");
    //     // res.render('view_campaign', {});
    //     res.send(campaign.name);
    // } catch (error) {
    //     console.log("connect error");
    // }
    

    createConnection().then(async connection => {
        const campaign = await connection.manager.findOne(Campaign, req.params);
        // res.render{'view_campaign', {campaign}};
        res.send(campaign.name);
    });
});

module.exports = router;