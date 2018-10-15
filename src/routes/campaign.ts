import { Request, Response, Router } from 'express';
import { createConnection, getConnection, getManager, getRepository } from 'typeorm';
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

    const campaignRepo = getRepository(Campaign);
        const campaign = await campaignRepo.find({where: {"ID": campaignID}}).catch(e => console.log(e));
            // .createQueryBuilder()
            // .select("campaign")
            // .from(Campaign, "campaign")
            // .getOne()
            // .then((camp) =>{
            //     console.log(camp);
            // })
            // .catch(e => {
            //     console.log('Oh shit',e)
            // })
        
        res.render('view-campaign', {
            id: campaign[0].ID,
            name: campaign[0].name,
            managers: campaign[0].manager,
            assignment: campaign[0].assignment,
            locations: campaign[0].locations,
            sDate: campaign[0].startDate,
            eDate: campaign[0].endDate,
            duration: campaign[0].avgDuration,
            questions: campaign[0].question,
            points: campaign[0].talkingPoint
        });
        // res.send('hold');

    // createConnection().then(async connection => {
    //     const campaign = await connection.manager.findOne(Campaign, req.params);
    //     // res.render{'view_campaign', {campaign}};
    //     res.send(campaign.name);
    // });
    });

export {router as campaignRouter}
