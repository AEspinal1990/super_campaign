import { Campaign } from '../backend/entity/Campaign';
import { getManager } from 'typeorm';
import { Questionaire } from '../backend/entity/Questionaire';
import { Locations } from '../backend/entity/Locations';
import { Canvasser } from '../backend/entity/Canvasser';
import { TalkPoint } from '../backend/entity/TalkPoint';
import { User } from '../backend/entity/User';
import { CampaignManager } from '../backend/entity/CampaignManager';

const googleMapsClient = require('@google/maps').createClient({
    key: 'AIzaSyAkzTbqwM75PSyw0vwMqiVb9eP6NjnClFk',
    Promise: Promise
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
    await Manager.save(campaign).catch(e => console.log(e));
};

export const getTalkingPoints = (campaign, talkingPoints) => {
    // Split up points by line breaks
    talkingPoints = talkingPoints.trim().split("\n");

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
        questions[i].campaign = campaign;
        questions[i].question = questionaire[i];
    }

    return questions;
};

export const saveQuestionaire = questionaire => {
    const Manager = getManager();
    /**
     * Save each indivdual question to the DB.
     */
    questionaire.forEach( async question => {
        await Manager.save(question).catch(e => console.log(e));
    });
};

function getStreetNumber(location) {
    return parseInt(location.split(',')[0]);
}

function getStreet(location){
    return (location.split(',')[1]).trim();
}

function getUnit(location) {
    let unit = location.split(',')[2];
    if(unit === undefined){
        return '';
    }
    return unit.trim();
}

function getCity(location) {
    return (location.split(',')[3]).trim();
}

function getState(location) {
    return (location.split(',')[4]).trim();
}

function getZip(location) {
    let zip = (location.split(',')[5]);
    parseInt(zip, 10);  // Necessary to ensure leading 0 is not removed    
    return zip;
}

function constructAddress(location){
    var address =
        location.streetNumber + " " +
        location.street + ", " +
        location.city + ", " +
        location.state + " " +
        location.zipcode;
    return address;

}

async function getCoords(address) {
    // let c;
    // await googleMapsClient.geocode({ address: address })
    //     .asPromise()
    //     .then(response => console.log(response.json.results[0].geometry.location))
    //     .catch(err => console.log(err));
    // console.log('GREAT!', c);

    // await googleMapsClient.geocode({ address: address }, function (err, response) {
    //     if (!err) {
    //         var coord = response.json.results[0].geometry.location;
    //         console.log(coord)
    //     } else {
    //         console.log("Geocode not found");
    //     }
    //     // CALLBACK FUNCTION - IN ORDER TO OBTAIN RESULTS, MUST OCCUR IN HERE
    //     //saveLocations(coord);
    // });
    // function saveLocations(coord) {
    //     location.lat = Number(coord.lat);
    //     location.long = Number(coord.lng);
    //     campaign.locations.push(newLocation);
    //     Manager.save(newCampaign).catch(e => console.log(e));
    //}
    
};

export const getLocations = async (campaign, locations) => {
    const Manager = getManager();

    locations = locations.trim().split('\n');

    let places = [];
    let address;
    for(let i in locations) {
        places.push(new Locations());
        places[i].streetNumber = getStreetNumber(locations[i]);
        places[i].street = getStreet(locations[i]);
        places[i].unit = getUnit(locations[i]);
        places[i].city = getCity(locations[i]);
        places[i].state = getState(locations[i]);
        places[i].zip = getZip(locations[i]);

        address = constructAddress(places[i]);

        /**
         * WTF is going on here!?!?
         */
        await googleMapsClient.geocode({ address: address }, function (err, response) {
            if (!err) {
                var coord = response.json.results[0].geometry.location;
            } else {
                return console.log("Geocode not found");
            }
            
            places[i].lat = Number(coord.lat);
            places[i].long = Number(coord.lng);
            campaign.locations.push(places[i]);
            
            Manager.save(campaign).catch(e => console.log(e));
        });
        
    }
    return places;    

    
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