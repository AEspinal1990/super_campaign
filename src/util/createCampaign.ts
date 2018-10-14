import { Campaign } from '../backend/entity/Campaign';
import { createConnection } from 'typeorm';
import { Questionaire } from '../backend/entity/Questionaire';


export const createCampaign = async campaignData => {

    //ASSIGN campaignData to variables
    let campaignName = campaignData.campaignName;
    let campaignManager;
    let startDate = campaignData.startDate;
    let endDate = campaignData.endDate;
    let talkingPoints = campaignData.talkingPoints;
    let questionaire = campaignData.questionaire;
    let averageExpectedDuration = campaignData.averageExpectedDuration;
    let locations = campaignData.locations;
    let canvassers = campaignData.canvassers;

    ///////////////////////////////////
    //PARSE THE DATA
    ///////////////////////////////////

    //For Camapaign Object
        //Parse date from format YYYY-MM-DD
    startDate = startDate.split("-");
    startDate = new Date(startDate[0], startDate[1], startDate[2]);
    endDate =  endDate.split("-");
    endDate = new Date(endDate[0], endDate[1], endDate[2]);
        //Assign parsed data to new campaign object
    const newCampaign:Campaign = new Campaign();
    newCampaign.name = campaignData.campaignName;
    newCampaign.startDate = startDate;
    newCampaign.endDate = endDate;
    newCampaign.avgDuration = averageExpectedDuration;
        //Save Campaign Object to database and get ID back
        //create variable to store ID of the campaign Object
    let newCampaignID;
    await createConnection()
    .then(async connection => {
        await connection.manager
            .save(newCampaign)
            .then(newCampaign => newCampaignID = newCampaign.ID);
    })
    .catch(e => {
        console.log(e);
    });        

    //For Questionaire Objects
        //Parse Questionaire for Questionaire table
    questionaire = questionaire.split("\n");
    for (let i in questionaire) {
        let newQuestionaire:Questionaire = new Questionaire();
        newQuestionaire.campaignID = newCampaignID;
        newQuestionaire.question = questionaire[i];
    }


}