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
export const createCampaignEnt = campaignData => {
    let campaignName = campaignData.campaignName;
    let startDate = campaignData.startDate;
    let endDate = campaignData.endDate;
    let averageExpectedDuration = campaignData.averageExpectedDuration;

    startDate = startDate.split("-");
    startDate = new Date(startDate[0], parseInt(startDate[1]) - 1, startDate[2]);
    endDate = endDate.split("-");
    endDate = new Date(endDate[0], parseInt(endDate[1]) - 1, endDate[2]);

    const newCampaign: Campaign = new Campaign();
    newCampaign.name = campaignName;
    newCampaign.startDate = startDate;
    newCampaign.endDate = endDate;
    newCampaign.avgDuration = averageExpectedDuration;
    return newCampaign;
};

//function to build talking points
function createTalkingPoints(campaignData, newCampaign) {
    let talkingPoints = campaignData.talkingPoints;
    talkingPoints = talkingPoints.split("\n");
    let allTalkingPoints = []
    for (let i in talkingPoints) {
        let newTalkingPoint: TalkPoint = new TalkPoint();
        newTalkingPoint.campaignID = newCampaign;
        newTalkingPoint.talk = talkingPoints[i];
        allTalkingPoints[i] = newTalkingPoint;
    }
    return allTalkingPoints;
};

//function to create a Questionaire for each question
function createQuestionnaires (campaignData, newCampaign) {
    let questionaire = campaignData.questionaire;
    questionaire = questionaire.trim().split("\n");
    let allQuestionnaires = [];
    for (let i in questionaire) {
        let newQuestionaire: Questionaire = new Questionaire();
        newQuestionaire.campaignID = newCampaign;
        newQuestionaire.question = questionaire[i];
        allQuestionnaires[i] = newQuestionaire;
    }
    return allQuestionnaires;

};

const parseDate = date => {
    let newDate = date.split("-");
    return new Date(newDate[0], newDate[1], newDate[2]);
}

export const createCampaign = async campaignData => {
    const Manager = getManager();

    //ASSIGN campaignData to variables
    let campaignManager = campaignData.managers;

    let questionaire = campaignData.questionaire;
    let averageExpectedDuration = campaignData.averageExpectedDuration;
    let locations = campaignData.locations;
    let canvasser = campaignData.canvassers;

    //For Camapaign Entity
    let newCampaign = createCampaignEnt(campaignData);
    await Manager.save(newCampaign).catch(e => console.log(e));

    //For Talking Points
    let allTalkingPoints = createTalkingPoints(campaignData, newCampaign);
    for (let i in allTalkingPoints) {
        await Manager.save(i).catch(e => console.log(e));
    }

    //For Questionaires
    let questionnaires = createQuestionnaires(campaignData, newCampaign);
    for (let i in questionnaires) {
        await Manager.save(i).catch(e => console.log(e));
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

    //For Manager Objects
    //access Manager database
    let campaignManagerRepository = Manager.getRepository(CampaignManager);
    //Parse manager string
    campaignManager = campaignManager.split("\n");
    //initialize manager
    newCampaign.manager = [];

    for (var i = 0; i < campaignManager.length; i++) {
        if (campaignManager[i] != "") {
            const use = await getManager()
                .findOne(User, { where: { "_employeeID": campaignManager[i] } });
            const cm = await getManager()
                .findOne(CampaignManager, { where: { "_ID": use } });;
            newCampaign.manager.push(cm);
        }
    }
    await Manager.save(newCampaign);

    //For Canvasser Objects 
    //access Canvasser database
    let canvasserRepository = Manager.getRepository(Canvasser);
    //Parse Locations for All Locations of Campaign Table
    const canvassers: string[] = canvasser.split("\n");

    for (var i = 0; i < canvassers.length; i++) {
        if (canvassers[i] != "") {
            const us = await getManager()
                .findOne(User, { where: { "_employeeID": canvassers[i] } })
            const ca = await getManager()
                .findOne(Canvasser, { where: { "_ID": us } });
            ca.campaignID.push(newCampaign);
            await Manager.save(ca);
        }
    }
};