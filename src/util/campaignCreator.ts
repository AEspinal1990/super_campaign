import { Campaign } from '../backend/entity/Campaign';
import { createConnection, getManager, getRepository } from 'typeorm';
import { Questionaire } from '../backend/entity/Questionaire';
import { Locations } from '../backend/entity/Locations';
import { Canvasser } from '../backend/entity/Canvasser';
import { TalkPoint } from '../backend/entity/TalkPoint';
import { User } from '../backend/entity/User';
import { CampaignManager } from '../backend/entity/CampaignManager';

export const createCampaign = async campaignData => {
    const Manager = getManager();

    //ASSIGN campaignData to variables
    let campaignName = campaignData.campaignName;
    let campaignManager = campaignData.managers;
    let startDate = campaignData.startDate;
    let endDate = campaignData.endDate;
    let talkingPoints = campaignData.talkingPoints;
    let questionaire = campaignData.questionaire;
    let averageExpectedDuration = campaignData.averageExpectedDuration;
    let locations = campaignData.locations;
    let canvasser = campaignData.canvassers;

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
    newCampaign.name = campaignName;
    newCampaign.startDate = startDate;
    newCampaign.endDate = endDate;
    newCampaign.avgDuration = averageExpectedDuration;
        //Save Campaign Object to database
    await Manager.save(newCampaign).catch(e => console.log(e));

    //For Talking Points
    talkingPoints = talkingPoints.split("\n");
    for(let i in talkingPoints) {
        let newTalkingPoint:TalkPoint = new TalkPoint();
        newTalkingPoint.campaignID = newCampaign;
        newTalkingPoint.talk = talkingPoints[i];
        await Manager.save(newTalkingPoint).catch(e => console.log(e));
    }
    //For Questionaire Objects
        //Parse Questionaire for Questionaire table
    questionaire = questionaire.split("\n");
    for (let i in questionaire) {
        let newQuestionaire:Questionaire = new Questionaire();
        newQuestionaire.campaignID = newCampaign;
        newQuestionaire.question = questionaire[i];
        await Manager.save(newQuestionaire).catch(e => console.log(e));
    }

    //For Location Objects
        //Parse Locations for All Locations of Campaign Table
    locations = locations.split("\n");

        //Initialize array of campaign locations
    newCampaign.locations = [];

    for (let i in locations) {
        if (locations[i] != "") {
            //create location object
            let locationParse = locations[i];
            locationParse = locationParse.split(", ");
            let newLocation:Locations = new Locations();
            newLocation.streetNumber = parseInt(locationParse[0]);
            newLocation.street = locationParse[1];
            newLocation.unit = locationParse[2];
            newLocation.city = locationParse[3];
            newLocation.state = locationParse[4];
            newLocation.zipcode = parseInt(locationParse[5]);

            //associate this new location to array
            newCampaign.locations.push(newLocation);
            //save location to location table
            await Manager.save(newLocation).catch(e => console.log(e));

            //check if location[i] is already in database
        }
    }
    //MAYBE MUST SAVE NEW CAMPAIGN OBJECT AGAIN AFTER SAVING THE OBJECTS SO THAT THE CAMPAIGN-LOCATION TABLE RELATION UPDATES
    await Manager.save(newCampaign).catch(e => console.log(e));

    //For Manager Objects
    const managers:string[] = campaignManager.split(" ");
    for(let i in managers) {
        const campaignManagersRepo = getRepository(CampaignManager);
        //var manager = await campaignManagersRepo.find({where: {"_ID_username": managers[i]}});
        //console.log(manager);
        //manager[i].currentCampaigns.push(newCampaign.ID);
        //await Manager.save(manager[i]);
    }


    //For Canvasser Objects 
        //Parse Locations for All Locations of Campaign Table
    const canvassers:string[] = canvasser.split(" ");
    for (var i=0;i<canvassers.length;i++) {
        const canRepo = getRepository(Canvasser);
        // keeps returning a list of all the canvassers from the username list in one call
        var canv = await canRepo.find({where: {"_ID_username": canvassers[i]}});
        console.log(canv[i].ID);
        canv[i].campaignID.push(newCampaign);
        await Manager.save(canv[i]);
    }
};

/** 
export const createCampaign = async campaignData => {
    const Manager = getManager();
    //ASSIGN campaignData to variables
    let campaignName = campaignData.campaignName;
    let campaignManager;
    let startDate = campaignData.startDate;
    let endDate = campaignData.endDate;
    let talkingPoints = campaignData.talkingPoints;
    let averageExpectedDuration = campaignData.averageExpectedDuration;
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
    newCampaign.name = campaignName;
    newCampaign.startDate = startDate;
    newCampaign.endDate = endDate;
    newCampaign.avgDuration = averageExpectedDuration;
        //Save Campaign Object to database
    await Manager.save(newCampaign).catch(e => console.log(e));
    return newCampaign;
}

export const createQuestionaires = async (campaignData , newCampaign)  => {
    const Manager = getManager();
    let questionaire = campaignData.questionaire;
    //For Questionaire Objects
        //Parse Questionaire for Questionaire table
    questionaire = questionaire.split("\n");
    for (let i in questionaire) {
        let newQuestionaire:Questionaire = new Questionaire();
        newQuestionaire.campaignID = newCampaign;
        newQuestionaire.question = questionaire[i];
        await Manager.save(newQuestionaire).catch(e => console.log(e));
    }
    return true;
}

export const createLocations = async (campaignData, newCampaign) => {
    const Manager = getManager();
    let locations = campaignData.locations;
    //For Location Objects
        //Parse Locations for All Locations of Campaign Table
    locations = locations.split("\n");

        //Initialize array of campaign locations
    newCampaign.locations = [];

    for (let i in locations) {
        if (locations[i] != "") {
            //create location object
            let locationParse = locations[i];
            locationParse = locationParse.split(", ");
            let newLocation:Locations = new Locations();
            newLocation.streetNumber = parseInt(locationParse[0]);
            newLocation.street = locationParse[1];
            newLocation.unit = locationParse[2];
            newLocation.city = locationParse[3];
            newLocation.state = locationParse[4]; 
            newLocation.zipcode = parseInt(locationParse[5]);

            //associate this new location to array
            newCampaign.locations.push(newLocation);
            //save location to location table
            await Manager.save(newLocation).catch(e => console.log(e));

            //check if location[i] is already in database
        }
    }
    return true;
}

export const saveObjects = async ()  => {
    const Manager = getManager();
}
**/
