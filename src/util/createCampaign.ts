import { Campaign } from '../backend/entity/Campaign';


export const createBaseCampaign = campaignData => {

    //PARSE THE DATA
    let campaignName = campaignData.campaignName;
    let campaignManager;

    //Parse date from format YYYY-MM-DD
    let startDate = campaignData.startDate
    //let endDate = req.body.campaign.endDate;
    //let talkingPoints = req.body.campaign.talkingPoints;
    //seperate questions and place them in table with primary key being the question and the campaign ID
    //let questionaire = req.body.campaign.questionaire;
    let averageExpectedDuration = campaignData.averageExpectedDuration;
    //parse location by lines
    //let locations = req.body.camapign.locations;
    //store somehow in a different table?
    //let canvassers = req.body.campaign.canvassers;
    
    //Assign parsed data to new campaign object
    const newCampaign:Campaign = new Campaign();
    newCampaign.name = campaignData.campaignName;
    newCampaign.manager = campaignData.username;
    newCampaign.startDate = new Date();
    newCampaign.endDate = new Date();
    newCampaign.avgDuration = averageExpectedDuration;
    newCampaign.locations;

    return newCampaign;
};