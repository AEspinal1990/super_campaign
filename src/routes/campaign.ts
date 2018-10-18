import { Request, Response, Router } from 'express';
import { getManager, getRepository } from 'typeorm';
import { Campaign } from '../backend/entity/Campaign';

import * as campaignCreator from '../util/campaignCreator';
import { Questionaire } from '../backend/entity/Questionaire';
import { TalkPoint } from '../backend/entity/TalkPoint';
import { Canvasser } from '../backend/entity/Canvasser';
import { Assignment } from '../backend/entity/Assignment';
import { Locations } from '../backend/entity/Locations';
import * as fs                          from 'fs';


const { createLogger, format, transports } = require('winston');
const router: Router = Router();

const path = require('path');
const env = process.env.NODE_ENV || 'development';
const logDir = 'log';


// Create the log directory if it does not exist
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

const filename = path.join(logDir, 'campaign.log');

const logger = createLogger({
  // change level if in dev environment versus production
  level: env === 'development' ? 'debug' : 'info',
  format: format.combine(
    format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss'
    }),
    format.printf(info => `${info.timestamp} ${info.level}: ${info.message}`)
  ),
  transports: [
    new transports.Console({
      level: 'info',
      format: format.combine(
        format.colorize(),
        format.printf(
          info => `${info.timestamp} ${info.level}: ${info.message}`
        )
      )
    }),
    new transports.File({ filename })
  ]
});
const isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next()
    } else {
        // res.redirect('/login');
        res.redirect('/');
    }
}

/**
 * GET and POST for create Campaign
 */
router.get('/new', isAuthenticated, async (req: Request, res: Response) => {
    res.render('create-campaign');
});

router.post('/', isAuthenticated, async (req: Request, res: Response) => {
    /** let newCampaignObject = createCampaign.createCampaign(req.body.campaign);
    createCampaign.createQuestionaires(req.body.campaign, newCampaignObject);
    createCampaign.createLocations(req.body.campaign, newCampaignObject);
    */
    //console.log(req.body.campaign);
    campaignCreator.createCampaign(req.body.campaign);
    logger.info(`CREATE CAMPAIGN - Created a campaign`);
    if (res.status(200))
        res.send("Campaign Created!");
    else
        res.send("Error!");
});

/**
 * GET and POST for edit Campaign
 */
router.get('/:id/edit', isAuthenticated, async (req: Request, res: Response) => {
    const campaignRepository = getRepository(Campaign);
    const campaignID = req.params.id;

    const campaign = await campaignRepository.find({where: {"_ID": campaignID}}).catch(e => console.log(e));
    if(campaign === undefined) {
        console.log('not found')
        res.status(404).render('edit-campaign', {
            missing: campaignID,
            username: "",
            name: "",
            role: "",
            id: 0
        });
    } 
    else {
        //parse Date
        let campaignStartDate:Date = campaign[0]._startDate;
        let campaignStartDateString = campaignStartDate.getFullYear() + "-" + campaignStartDate.getMonth() + "-" + campaignStartDate.getDay();
        let campaignEndDate:Date = campaign[0]._endDate;
        let campaignEndDateString = campaignEndDate.getFullYear() + "-" + campaignEndDate.getMonth() + "-" + campaignEndDate.getDay();

        //parse questions back to input form
        let questionaireRepository = getRepository(Questionaire);
        let questionaire = await questionaireRepository.find({where: {"_campaignID": campaignID}}).catch(e => console.log(e));
        campaign[0].question = questionaire;
        let questionsInput = "";
        for (let i in campaign[0].question) {
            questionsInput += campaign[0].question[i].question + "\n";
        }
        //parse talking points back to input form
        let talkPointRepository = getRepository(TalkPoint);
        let talkPoint = await talkPointRepository.find({where: {"_campaignID": campaignID}}).catch(e => console.log(e));
        campaign[0].talkingPoint = talkPoint;
        let talkPointInput = "";
        for (let i in campaign[0].talkingPoint) {
            talkPointInput += campaign[0].talkingPoint[i].talk + "\n";
        }

        //parse locations back to input form
        let locationsRepository = getRepository(Locations);
        //let locations = await locationsRepository.find({where: {"_campaignID": campaignID}}).catch(e => console.log(e));
        //campaign[0].locations = locations;
        let locationsInput = "";
        for(let i in campaign[0].locations) {
            locationsInput += campaign[0].locations[i]._streetNumber + ", " +
                                campaign[0].locations[i]._street + ", " +
                                campaign[0].locations[i]._unit + ", " +
                                campaign[0].locations[i]._city + ", " +
                                campaign[0].locations[i]._state + ", " +
                                campaign[0].locations[i]._zipcode + "\n";
        }

        //parse managers back to input form
        let campaignManagers = campaign[0]._manager;
        let campaignManagersString = "";
        for (let i in campaignManagers) {
            campaignManagersString += campaignManagers[i]._ID._employeeID + "\n";
        }
        //console.log(campaignManagersString);

        
        //parse canvassers back to input form
        let campaignCanvasser = await getManager()
            .createQueryBuilder(Canvasser, "canvasser")
            .leftJoinAndSelect("canvasser._campaignID", "campaign")
            .leftJoinAndSelect("canvasser._ID", "user")
            .where("campaign._ID = :ID", { ID: req.params.id})
            .getMany();       

        let campaignCanvassersString = "";
        for(let i in campaignCanvasser) {
            //campaignCanvasserString += i.ID + "\n";
            campaignCanvassersString += campaignCanvasser[i].ID.employeeID + "\n";
        }
        //console.log(campaignCanvasserString);

        res.status(200).render('edit-campaign', {
            campaignName : campaign[0].name,
            campaignManagers : campaignManagersString,
            campaignLocations : locationsInput,
            campaignStartDate : campaignStartDateString,
            campaignEndDate : campaignEndDateString,
            campaignAvgDuration : campaign[0]._avgDuration,
            campaignQuestions : questionsInput,
            campaignTalkPoints : talkPointInput,
            campaignCanvassers : campaignCanvassersString,
            campaignID : req.params.id
        });
        logger.info(`EDIT CAMPAIGN - Editted a campaign`);
    }
});
// router.post('/:id', async (req: Request, res: Response) => {
//     campaignEditor.editCampaign(req.body.campaign, req.params.id);
//     if (res.status(200))
//         res.send("Campaign Edited!");
//     else
//         res.send("Error!");
// });

/**
 * GET for view campaign
 */
router.get('/:id/view', isAuthenticated, async (req: Request, res: Response) => {
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
        // const mRepo = getRepository(CampaignManager);
        // const cm = await mRepo.find({where: {"_"}});
        // campaign[0].manager = cm;

        // LOAD CANVASSERS FROM DB
        const canva = await getManager()
            .createQueryBuilder(Canvasser, "canvasser")
            .leftJoinAndSelect("canvasser._campaignID", "campaign")
            .leftJoinAndSelect("canvasser._ID", "user")
            .where("campaign._ID = :ID", { ID: req.params.id})
            .getMany();

            //console.log(campaign[0]);
            //console.log(canva);
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
