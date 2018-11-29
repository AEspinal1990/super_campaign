import { getManager, getRepository } from "typeorm";
import { Campaign } from "../backend/entity/Campaign";
import { TalkPoint } from "../backend/entity/TalkPoint";
import { Questionaire } from "../backend/entity/Questionaire";
import { Locations } from "../backend/entity/Locations";
import { CampaignManager } from "../backend/entity/CampaignManager";
import { User } from "../backend/entity/User";
import { Canvasser } from "../backend/entity/Canvasser";
import * as campaignParser      from './campaignParser';
const logger = require('../util/logger');
const campaignLogger = logger.getLogger('campaignLogger');
const googleMapsClient = require('@google/maps').createClient({
    key: 'AIzaSyAkzTbqwM75PSyw0vwMqiVb9eP6NjnClFk'
});

export const initCampaign = updatedCampaign => {
    let properties;
    let startDate: Date;
    let endDate: Date;
    let avgDuration: number;
    let talkingPoints: TalkPoint[];
    let questions: Questionaire[];
    let managers: CampaignManager[];
    let canvassers: Canvasser[];
    let locations: Location[];


    
    startDate = campaignParser.getDate(updatedCampaign.startDate);
    endDate = campaignParser.getDate(updatedCampaign.endDate);
    avgDuration = Number(updatedCampaign.averageExpectedDuration);

    // Create Campaign Object
    const campaign: Campaign = new Campaign();
    
    // Parse the talking points
    talkingPoints = campaignParser.getTalkingPoints(campaign, updatedCampaign.talkingPoints);

    // Parse the questionnaire
    questions = campaignParser.getQuestionnaire(campaign, updatedCampaign.questionaire)
    
    // Parse the Campaign Managers
    managers = campaignParser.getManagers(updatedCampaign.managers);
    
    // Parse the Canvassers
    canvassers = campaignParser.getCanvassers(updatedCampaign.canvassers);

    // Parse the locations
    locations = campaignParser.getLocations(updatedCampaign.locations)

    // Decorate Campaign object
    campaign.name = updatedCampaign.campaignName;
    campaign.startDate = startDate;
    campaign.endDate = endDate;
    campaign.avgDuration = avgDuration;
    campaign.talkingPoint = talkingPoints;
    campaign.question = questions;
    campaign.managers = managers;
    
    
    return [updatedCampaign.campaignName, startDate, endDate, avgDuration, 
        talkingPoints, questions, managers];
}

export const compareNames = (originalname, updatedName) => {
    console.log(originalname)
    console.log(updatedName)
    return (originalname === updatedName);
}

export const compareDates = (originalDate, updatedDate) => { 
    let date: Date = campaignParser.getDate(updatedDate);
    originalDate = date.getFullYear() + "-" 
        + (date.getMonth() + 1) + "-" 
        + date.getDate();
    return (originalDate === updatedDate);
}


export const compareAvgDurations = (originalAvgDuration, updatedAvgDuration) => {
    console.log(originalAvgDuration + " vs " + updatedAvgDuration)
    return (originalAvgDuration == updatedAvgDuration)
}

export const updatedDate = (updatedDate) => {
    return campaignParser.getDate(updatedDate);
}

export const updateTalkingPoints = async (campaign, talkingPoints) => {
    talkingPoints = campaignParser.getTalkingPoints(campaign, talkingPoints);

    /**
     * Delete original talking points
     */
    await getRepository(TalkPoint)
        .createQueryBuilder()
        .delete()
        .where("_campaign = :ID", { ID: campaign._ID })
        .execute();

    /**
     * Save each indivdual talking point to the DB.
     */
    talkingPoints.forEach(async point => {
        await getManager().save(point).catch(e => console.log(e));
    });
}

export const updateQuestionnaire = async (campaign, questionaire) => {
    questionaire = campaignParser.getQuestionnaire(campaign, questionaire);

    /**
     * Delete original questions
     */
    await getRepository(Questionaire)
        .createQueryBuilder()
        .delete()
        .where("_campaign = :ID", { ID: campaign._ID })
        .execute();

    /**
     * Update the questions in the DB.
     */
    questionaire.forEach(async question => {
        await getManager().save(question).catch(e => console.log(e));
    });
}


export const updateManagers = async (campaign, managers) => {
    let usr;
    let cm;
    managers = campaignParser.getManagers(managers);
    campaign.managers = [];
    for (let i in managers) {
        if (managers[i] != "") {
            usr = await getManager()
                .findOne(User, { where: { "_employeeID": managers[i] } });

            // If user exist
            if (usr !== undefined) {
                cm = await getManager()
                    .findOne(CampaignManager, { where: { "_ID": usr } });

                // If user is a campaign manager
                if (cm !== undefined) {
                    campaign.managers.push(cm);
                } else {
                    
                    campaignLogger.warn(`${usr._username} is not a campaign manager, not added`);
                }

            } else {
                campaignLogger.warn(`${managers[i]} does not exist`);
            }

        }
    }
    console.log('Saving', campaign._ID, campaign._name)
    await getManager().save(campaign).catch(e => console.log(e));
}


export const updateCanvassers = async (campaign, canvassers) => {


    let usr;
    let canvass;
    canvassers = campaignParser.getCanvassers(canvassers);

    campaign.canvassers = [];
    for (let i in canvassers) {
        if (canvassers[i] != "") {
            usr = await getManager()
                .findOne(User, { where: { "_employeeID": canvassers[i] } });
            // If user exist
            if (usr !== undefined) {
                canvass = await getManager()
                    .findOne(Canvasser, { where: { "_ID": usr } });
                // If user is a canvasser
                if (canvass !== undefined) {
                    campaign.canvassers.push(canvass);
                    canvass.campaigns.push(campaign);
                } else {
                    campaignLogger.warn(`${usr._username} is not a canvasser`);
                }

            } else {
                campaignLogger.warn(`${canvassers[i]} does not exist`);
            }

        }
    }
    await getManager().save(campaign.canvassers)
        .catch(e => console.log('Error', e));
}