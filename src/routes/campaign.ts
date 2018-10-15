import { Request, Response, Router } from 'express';
import { createConnection, getConnection, getManager, getRepository } from 'typeorm';
import { Campaign } from '../backend/entity/Campaign';

import * as campaignCreator from '../util/campaignCreator';
import { CampaignManager } from '../backend/entity/CampaignManager';
import { User } from '../backend/entity/User';

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
        const campaign = await campaignRepo.find({where: {"ID": campaignID}})
        .catch(e => console.log(e));
           
        if (campaign[0] === undefined){
            console.log("NOT FOUND");
            res.status(404).render('view-campaign');
        }
        
        res.render('view-campaign', {
            id: campaign[0].ID,
            name: campaign[0].name,
            manager: campaign[0].manager,
            assignment: "",
            locations: campaign[0].locations,
            sDate: campaign[0].startDate,
            eDate: campaign[0].endDate,
            duration: campaign[0].avgDuration,
            questions: campaign[0].question,
            points: campaign[0].talkingPoint,
            canvasser: campaign[0].canvasser
        });
        // res.send('hold');
    });

export {router as campaignRouter}
