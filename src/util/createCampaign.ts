import { Campaign } from '../backend/entity/Campaign';


export const createBaseCampaign = campaignData => {

    //PARSE THE DATA
    ///////////////////////////////////
    let campaignName = campaignData.campaignName;
    let campaignManager;

    //Parse date from format YYYY-MM-DD
    let startDate = campaignData.startDate;
    startDate = startDate.split("-");
    startDate = new Date(startDate[0], startDate[1], startDate[2]);
    let endDate = campaignData.endDate;
    endDate =  endDate.split("-");
    endDate = new Date(endDate[0], endDate[1], endDate[2]);

    let talkingPoints = campaignData.talkingPoints;
    //seperate questions and place them in table with primary key being the question and the campaign ID
    let questionaire = campaignData.questionaire;
    let averageExpectedDuration = campaignData.averageExpectedDuration;
    //parse location by lines
    let locations = campaignData.locations;
    //store somehow in a different table?
    let canvassers = campaignData.canvassers;
    
    //Assign parsed data to new campaign object
    const newCampaign:Campaign = new Campaign();
    newCampaign.name = campaignData.campaignName;
    //newCampaign.manager = campaignData.username;
    newCampaign.startDate = startDate;
    newCampaign.endDate = endDate;
    //newCampaign.talkingPoint = talkingPoints;
    newCampaign.avgDuration = averageExpectedDuration;
    //newCampaign.locations = locations;

    return newCampaign;
};