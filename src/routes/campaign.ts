import { Request, Response, Router } from 'express';
import { getManager, getRepository } from 'typeorm';
import { Campaign } from '../backend/entity/Campaign';
import * as campaignEditor from '../util/campaignEditor';
import * as campaignCreator from '../util/campaignCreator';
import { Questionaire } from '../backend/entity/Questionaire';
import { TalkPoint } from '../backend/entity/TalkPoint';
import { Canvasser } from '../backend/entity/Canvasser';
import { Assignment } from '../backend/entity/Assignment';
import { Locations } from '../backend/entity/Locations';
import * as fs from 'fs';
import server, { io } from '../server';


const googleMapsClient = require('@google/maps').createClient({
    key: 'AIzaSyAkzTbqwM75PSyw0vwMqiVb9eP6NjnClFk'
});

const router: Router = Router();

const winston = require('winston');
const logger = require('../util/logger');
const campaignLogger = winston.loggers.get('campaignLogger');

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

router.post('/', async (req: Request, res: Response) => {
      
    let startDate;
    let endDate;
    let avgDuration;
    let campaign;

    /**
     * Grab dates needed to create campaign object
     */
    startDate = campaignCreator.getDate(req.body.campaign.startDate);
    endDate = campaignCreator.getDate(req.body.campaign.endDate);
    avgDuration = Number(req.body.campaign.averageExpectedDuration);

    /**
     * Create Campaign then save it.
     */
    campaign = campaignCreator.initCampaign(req.body.campaign.campaignName, startDate, endDate, avgDuration);
    await campaignCreator.saveCampaign(campaign);
    campaignLogger.info(`Saved campaign: ${campaign._name}`);

    /**
     * Parse the talking points then save them.
     */
    await campaignCreator.saveTalkingPoints(campaign, req.body.campaign.talkingPoints);
    campaignLogger.info(`Saved talking points for: ${campaign._name}`);

    /**
     * Parse the questionaire then save it.
     */
    await campaignCreator.saveQuestionaire(campaign, req.body.campaign.questionaire);
    campaignLogger.info(`Saved questionaire for: ${campaign._name}`);

    /**
     * Save campaign managers
     */
    await campaignCreator.saveManagers(campaign, req.body.campaign.managers);
    campaignLogger.info(`Saved managers for: ${campaign._name}`);

    /**
     * Save this campaigns locations
     */
    await campaignCreator.saveLocations(campaign, req.body.campaign.locations);
    campaignLogger.info(`Saved locations for: ${campaign._name}`);

    /**
     * Save canavassers
     */
    await campaignCreator.saveCanavaser(campaign, req.body.campaign.canvassers);
    res.send('okay');
});

/**
 * GET and POST for edit Campaign
 */
router.get('/edit/:id', isAuthenticated, async (req: Request, res: Response) => {
    const campaignRepository = getRepository(Campaign);
    const campaignID = req.params.id;
    
    const campaign = await campaignRepository.find({ where: { "_ID": campaignID } }).catch(e => console.log(e));
    if (campaign === undefined) {
        console.log('not found')
        res.status(404).render('edit-campaign', {
            missing: campaignID,
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
    }
    else {
        //parse Date
        let campaignStartDate: Date = campaign[0]._startDate;
        let campaignStartDateString = campaignStartDate.getFullYear() + "-" + campaignStartDate.getMonth() + "-" + campaignStartDate.getDay();
        let campaignEndDate: Date = campaign[0]._endDate;
        let campaignEndDateString = campaignEndDate.getFullYear() + "-" + campaignEndDate.getMonth() + "-" + campaignEndDate.getDay();

        //parse questions back to input form
        let questionaireRepository = getRepository(Questionaire);
        let questionaire = await questionaireRepository.find({ where: { "Campaign_ID": campaignID } }).catch(e => console.log(e));
        campaign[0].question = questionaire;
        let questionsInput = "";
        for (let i in campaign[0].question) {
            questionsInput += campaign[0].question[i].question + "\n";
        }
        //parse talking points back to input form
        let talkPointRepository = getRepository(TalkPoint);
        let talkPoint = await talkPointRepository.find({ where: { "Campaign_ID": campaignID } }).catch(e => console.log(e));
        campaign[0].talkingPoint = talkPoint;
        let talkPointInput = "";
        for (let i in campaign[0].talkingPoint) {
            talkPointInput += campaign[0].talkingPoint[i].talk + "\n";
        }

        //parse locations back to input form
        let locationsInput = "";
        for (let i in campaign[0].locations) {
            
            locationsInput += campaign[0].locations[i]._streetNumber + ", " +
                campaign[0].locations[i]._street + ", " +
                campaign[0].locations[i].unit + ", " +
                campaign[0].locations[i].city + ", " +
                campaign[0].locations[i].state + ", " +
                campaign[0].locations[i].zipcode + "\n";
        }

        //parse managers back to input form
        let campaignManagers = campaign[0].managers;
        let campaignManagersString = "";
        for (let i in campaignManagers) {
            campaignManagersString += campaignManagers[i].ID.employeeID + "\n";
        }

        //parse canvassers back to input form
        let campaignCanvasser = await getManager()
            .createQueryBuilder(Canvasser, "canvasser")
            .leftJoinAndSelect("canvasser._campaigns", "campaign")
            .leftJoinAndSelect("canvasser._ID", "user")
            .where("campaign._ID = :ID", { ID: req.params.id })
            .getMany();

        let campaignCanvassersString = "";
        for (let i in campaignCanvasser) {
            campaignCanvassersString += campaignCanvasser[i].ID.employeeID + "\n";
        }
        res.status(200).render('edit-campaign', {
            campaignName: campaign[0].name,
            campaignManagers: campaignManagersString,
            campaignLocations: locationsInput,
            campaignStartDate: campaignStartDateString,
            campaignEndDate: campaignEndDateString,
            campaignAvgDuration: campaign[0]._avgDuration,
            campaignQuestions: questionsInput,
            campaignTalkPoints: talkPointInput,
            campaignCanvassers: campaignCanvassersString,
            campaignID: req.params.id
        });
        campaignLogger.info(`/edit/${req.params.id} - Updated Campaign`);
    }
});

router.post('/:id', isAuthenticated, async (req: Request, res: Response) => {
    campaignEditor.editCampaign(req.body.campaign, req.params.id);
    if (res.status(200))
        res.send("Campaign Edited!");
    else
        res.send("Error!");
});

/**
 * GET for view campaign
 */
router.get('/view/:id', isAuthenticated, async (req: Request, res: Response) => {
    var campaign = await getManager().find(Campaign, 
        { where: { "_ID": req.params.id } })
        .catch(e => console.log(e));
    // console.log(campaign[0]);

    if (campaign[0] === undefined) {
        console.log("NOT FOUND");
        res.status(404).send('Campaign with ID: '+req.params.id+' was not found!');
    } else {
        // MANUAL LOAD FROM DB - Questoinaire AND TALKING POINTS
        const qRepo = getRepository(Questionaire);
        const questionaire = await qRepo.find({ where: { "_campaign": campaign[0].ID } });
        campaign[0].question = questionaire;
        const tRepo = getRepository(TalkPoint);
        const tpoints = await tRepo.find({ where: { "_campaign": req.params.id } });
        campaign[0].talkingPoint = tpoints;

        // LOAD CANVASSERS FROM DB
        const canva = await getManager()
            .createQueryBuilder(Canvasser, "canvasser")
            .leftJoinAndSelect("canvasser._campaigns", "campaign")
            .leftJoinAndSelect("canvasser._ID", "user")
            .where("campaign._ID = :ID", { ID: req.params.id })
            .getMany();

        // send geocodes through socket
        var geocodes = [];
        for (let i in campaign[0].locations) {
            geocodes.push({
                lat: campaign[0].locations[i].lat,
                lng: campaign[0].locations[i].long
            });
        }
        // lets make a new connection socket for the view url and change the path from client
        io.on('connection', function(socket) {
            socket.emit('geocodes', geocodes);
            console.log('someone CONNECTED:');
            // console.log(geocodes);            
        });

        res.render('view-campaign', {
            id: campaign[0].ID,
            name: campaign[0].name,
            manager: campaign[0].managers,
            assignment: "",
            sDate: campaign[0].startDate,
            endDate: campaign[0].endDate,
            duration: campaign[0].avgDuration,
            locationz: campaign[0].locations,
            question: campaign[0].question,
            points: campaign[0].talkingPoint,
            canv: canva,
        });
    }
});


export { router as campaignRouter }
