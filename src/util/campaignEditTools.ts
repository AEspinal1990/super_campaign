import { getManager, getRepository } from "typeorm";
import { Campaign } from "../backend/entity/Campaign";
import { TalkPoint } from "../backend/entity/TalkPoint";
import { Questionaire } from "../backend/entity/Questionaire";
import { Locations } from "../backend/entity/Locations";
import { CampaignManager } from "../backend/entity/CampaignManager";
import { User } from "../backend/entity/User";
import { Canvasser } from "../backend/entity/Canvasser";
import * as campaignParser      from './campaignParser';

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
    console.log(originalDate + " vs ", date)
    return (originalDate === date);
}


export const compareAvgDurations = (originalAvgDuration, updatedAvgDuration) => {
    return (originalAvgDuration === updatedAvgDuration)
}

export const compareTalkingPoints = (originalTalkingPoints, updatedTalkingPoints) => {

}

export const compareQuestionnaires = (originalQuestions, updatedQuestions) => {

}