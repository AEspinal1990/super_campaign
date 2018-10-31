import { Campaign } from '../backend/entity/Campaign';
import { getManager } from 'typeorm';
import { Questionaire } from '../backend/entity/Questionaire';
import { Locations } from '../backend/entity/Locations';
import { Canvasser } from '../backend/entity/Canvasser';
import { TalkPoint } from '../backend/entity/TalkPoint';
import { User } from '../backend/entity/User';
import { CampaignManager } from '../backend/entity/CampaignManager';

const googleMapsClient = require('@google/maps').createClient({
    key: 'AIzaSyAkzTbqwM75PSyw0vwMqiVb9eP6NjnClFk'
});

// function to build campaign data
export const createCampaignInfo = campaignData => {
    let campaignName = campaignData.campaignName;
    let campaignManager = campaignData.managers;
    let startDate = campaignData.startDate;
    let endDate = campaignData.endDate;
    let averageExpectedDuration = campaignData.averageExpectedDuration;
    //let talkingPoints = campaignData.talkingPoints;
    //let questionaire = campaignData.questionaire;
    //let locations = campaignData.locations;
    //let canvassers = campaignData.canvassers;
    startDate = startDate.split("-");
    startDate = new Date(startDate[0], startDate[1], startDate[2]);
    endDate = endDate.split("-");
    endDate = new Date(endDate[0], endDate[1], endDate[2]);
    const newCampaign: Campaign = new Campaign();
    newCampaign.name = campaignName;
    newCampaign.startDate = startDate;
    newCampaign.endDate = endDate;
    newCampaign.avgDuration = averageExpectedDuration;
    return newCampaign;
};

//function to build talking points
export const createTalkingPoints = campaignData => {
    let newCampaign = createCampaignInfo(campaignData);
    let talkingPoints = campaignData.talkingPoints;
    talkingPoints = talkingPoints.split("\n");
    let allTalkingPoints = []
    for (let i in talkingPoints) {
        let newTalkingPoint: TalkPoint = new TalkPoint();
        newTalkingPoint.campaign = newCampaign;
        newTalkingPoint.talk = talkingPoints[i];
        allTalkingPoints[i] = newTalkingPoint;
    }
    return allTalkingPoints;
};

export const getDate = date => {
    date = date.split("-");
    return new Date(date[0], date[1], date[2]);
};

export const initCampaign = (name, sDate, eDate, avgDuration) => {
    const newCampaign: Campaign = new Campaign();
    newCampaign.name = name;
    newCampaign.startDate = sDate;
    newCampaign.endDate = eDate;
    newCampaign.avgDuration = avgDuration;
    return newCampaign;
};

export const saveCampaign = async campaign => {
    const Manager = getManager();
    // await Manager.save(campaign).catch(e => console.log(e));
};

export const getTalkingPoints = (campaign, talkingPoints) => {
    // Split up points by line breaks
    talkingPoints = talkingPoints.split("\n");
    
    /**
     * Create talking points and insert into array
     */
    let points = [];
    for (let i in talkingPoints) {
        points.push(new TalkPoint());
        points[i].campaign = campaign;
        points[i].talk = talkingPoints[i];       
    }

    return points;
};

export const saveTalkingPoints = talkingPoints => {   
    const Manager = getManager();
    /**
     * Save each indivdual talking point to the DB.
     */
    talkingPoints.forEach( async point => {
        await Manager.save(point).catch(e => console.log(e));
    });
};

export const getQuestionaire = (campaign, questionaire) => {
    questionaire = questionaire.trim().split("\n");

    /**
     * Create questions and insert into array
     */
    let questions = [];
    for (let i in questionaire) {
        questions.push(new Questionaire());
    }
    // for (let i in questionaire) {
    //     let newQuestionaire: Questionaire = new Questionaire();
    //     newQuestionaire.campaign = newCampaign;
    //     newQuestionaire.question = questionaire[i];
    // }
};



//function to build questionnaires
export const createQuestionnaires = campaignData => {
    let newCampaign = createCampaignInfo(campaignData);
    let questionaire = campaignData.questionaire;
    questionaire = questionaire.trim().split("\n");
    let allquestionnaires = [];
    for (let i in questionaire) {
        let newQuestionaire: Questionaire = new Questionaire();
        newQuestionaire.campaign = newCampaign;
        newQuestionaire.question = questionaire[i];
        allquestionnaires[i] = newQuestionaire;
    }
    return allquestionnaires;

};

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
    endDate = endDate.split("-");
    endDate = new Date(endDate[0], endDate[1], endDate[2]);

    //Assign parsed data to new campaign object
    const newCampaign: Campaign = new Campaign();
    newCampaign.name = campaignName;
    newCampaign.startDate = startDate;
    newCampaign.endDate = endDate;
    newCampaign.avgDuration = averageExpectedDuration;
    //Save Campaign Object to database
    await Manager.save(newCampaign).catch(e => console.log(e));

    //For Talking Points
    talkingPoints = talkingPoints.split("\n");
    for (let i in talkingPoints) {
        let newTalkingPoint: TalkPoint = new TalkPoint();
        newTalkingPoint.campaign = newCampaign;
        newTalkingPoint.talk = talkingPoints[i];
        console.log('Saving the talking point', newTalkingPoint);
        await Manager.save(newTalkingPoint).catch(e => console.log(e));
    }
    //For Questionaire Objects
    //Parse Questionaire for Questionaire table
    questionaire = questionaire.trim().split("\n");
    for (let i in questionaire) {
        let newQuestionaire: Questionaire = new Questionaire();
        newQuestionaire.campaign = newCampaign;
        newQuestionaire.question = questionaire[i];
        await Manager.save(newQuestionaire).catch(e => console.log(e));
    }
    await Manager.save(newCampaign).catch(e => console.log(e));

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
            let newLocation: Locations = new Locations();
            newLocation.streetNumber = parseInt(locationParse[0]);
            newLocation.street = locationParse[1];
            newLocation.unit = locationParse[2];
            newLocation.city = locationParse[3];
            newLocation.state = locationParse[4];
            newLocation.zipcode = parseInt(locationParse[5]);
            newLocation.lat = -1;
            newLocation.long = -1;
            // get geocode and add
            var address =
                newLocation.streetNumber + " " +
                newLocation.street + ", " +
                newLocation.city + ", " +
                newLocation.state + " " +
                newLocation.zipcode;

            await googleMapsClient.geocode({ address: address }, function (err, response) {
                if (!err) {
                    var coord = response.json.results[0].geometry.location;
                } else {
                    console.log("Geocode not found");
                }
                // CALLBACK FUNCTION - IN ORDER TO OBTAIN RESULTS, MUST OCCUR IN HERE
                saveLocations(coord);
            });
            function saveLocations(coord) {
                newLocation.lat = Number(coord.lat);
                newLocation.long = Number(coord.lng);
                newCampaign.locations.push(newLocation);
                Manager.save(newCampaign).catch(e => console.log(e));
            }
        }
    }

    campaignManager = campaignManager.split("\n");
    //initialize manager
    newCampaign.managers = [];

    for (var i = 0; i < campaignManager.length; i++) {
        if (campaignManager[i] != "") {
            const use = await getManager()
                .findOne(User, { where: { "_employeeID": campaignManager[i] } });
            const cm = await getManager()
                .findOne(CampaignManager, { where: { "_ID": use } });;
            newCampaign.managers.push(cm);
        }
    }
    await Manager.save(newCampaign);

   //Parse Locations for All Locations of Campaign Table
    const canvassers: string[] = canvasser.split("\n");

    for (var i = 0; i < canvassers.length; i++) {
        if (canvassers[i] != "") {
            const us = await getManager()
                .findOne(User, { where: { "_employeeID": canvassers[i] } })
            const ca = await getManager()
                .findOne(Canvasser, { where: { "_ID": us } });
            ca.campaigns.push(newCampaign);
            await Manager.save(ca);
        }
    }
};