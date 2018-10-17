import { Request, Response, Router } from 'express';
import { createConnection, getConnection, getManager, getRepository, getTreeRepository, Connection, MongoEntityManager } from 'typeorm';
import { Campaign } from '../backend/entity/Campaign';

import * as campaignCreator from '../util/campaignCreator';
import { CampaignManager } from '../backend/entity/CampaignManager';
import { User } from '../backend/entity/User';
import { Questionaire } from '../backend/entity/Questionaire';
import { TalkPoint } from '../backend/entity/TalkPoint';
import { getRepo } from '../util/userManagementSystem';
import { Canvasser } from '../backend/entity/Canvasser';
import { Assignment } from '../backend/entity/Assignment';

const router: Router = Router();
/**
 * GET and POST for create Campaign
 */
router.get('/new', async (req: Request, res: Response) => {
    res.render('create-campaign');
});

router.post('/', async (req: Request, res: Response) => {
    /** let newCampaignObject = createCampaign.createCampaign(req.body.campaign);
    createCampaign.createQuestionaires(req.body.campaign, newCampaignObject);
    createCampaign.createLocations(req.body.campaign, newCampaignObject);
    */
    console.log(req.body.campaign);
    campaignCreator.createCampaign(req.body.campaign);
    if (res.status(200))
        res.send("Campaign Created!");
    else
        res.send("Error!");
});

/**
 * GET and POST for edit Campaign
 */
router.get('/:id/edit', async (req: Request, res: Response) => {
    const campaignRepository = getRepository(Campaign);
    const campaignID = req.params.id;

    const campaign = await campaignRepository.findOne(campaignID).catch(e => console.log(e));
});
router.post('/:id', async (req: Request, res: Response) => {







});

/**
 * GET for view campaign
 */
router.get('/:id/view', async (req: Request, res: Response) => {
    const campaignRepo = getRepository(Campaign);
    var campaign = await campaignRepo
        .find({where: {"_ID": req.params.id}})
        .catch(e => console.log(e));

    const qRepo = getRepository(Questionaire);
        const questionaire = await qRepo.find({where: {"_campaignID": campaign[0].ID}})
        campaign[0].question = questionaire;

    if (campaign[0] === undefined) {
        console.log("NOT FOUND");
        res.status(404).render('view-campaign', {
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
        /*
            Creating Talking Points, Assignment entity into DB
        */
        var tpoint:TalkPoint = new TalkPoint();
        tpoint.campaignID = campaign[0];
        tpoint.talk = "talk1";
        await getManager().save(tpoint).catch(e => console.log(e));

        campaign[0].assignment = new Assignment();
        await getManager().save(campaign[0]).catch(e => console.log(e));

        // MANUAL LOAD FROM DB - CM AND TALKING POINTS
        const tRepo = getRepository(TalkPoint);
        const tpoints = await tRepo.find({where: {"_campaignID": req.params.id}});
        campaign[0].talkingPoint = tpoints;
        const mRepo = getRepository(CampaignManager);
        const cm = await mRepo.find();
        campaign[0].manager = cm;

        // LOAD CANVASSERS FROM DB
        const canva = await getManager()
            .createQueryBuilder(Canvasser, "canvasser")
            .leftJoinAndSelect("canvasser._campaignID", "campaign")
            .leftJoinAndSelect("canvasser._ID", "user")
            .where("campaign._ID = :ID", { ID: req.params.id})
            .getMany();

            console.log(campaign[0]);
            console.log(canva);
        res.render('view-campaign', {
            id: campaign[0].ID,
            name: campaign[0].name,
            manager: campaign[0].manager,
            assignment: "",
            sDate: campaign[0].startDate,
            endDate: campaign[0].endDate,
            duration: campaign[0].avgDuration,
            location: campaign[0].locations,
            question: campaign[0].question,
            points: campaign[0].talkingPoint,
            canv: canva
        });
    }
});

export { router as campaignRouter }
