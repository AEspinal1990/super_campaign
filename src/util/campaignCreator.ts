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
    let startDate = campaignData.startDate;
    let endDate = campaignData.endDate;
    let averageExpectedDuration = campaignData.averageExpectedDuration;
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

const getTalkingPoints = (campaign, talkingPoints) => {
    // Split up points by line breaks and remove carriage returns
    talkingPoints = talkingPoints.trim().split("\n");
    for (let i in talkingPoints) {
        talkingPoints[i] = talkingPoints[i].replace('\r', '');
    }

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

export const saveTalkingPoints = (campaign, talkingPoints) => {
    const Manager = getManager();
    talkingPoints = getTalkingPoints(campaign, talkingPoints);

    /**
     * Save each indivdual talking point to the DB.
     */
    talkingPoints.forEach(async point => {
        await Manager.save(point).catch(e => console.log(e));
    });
};

const getQuestionaire = (campaign, questionaire) => {
    questionaire = questionaire.trim().split("\n");
    for (let i in questionaire) {
        questionaire[i] = questionaire[i].replace('\r', '');
    }

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

export const saveQuestionaire = (campaign, questionaire) => {
    const Manager = getManager();
    questionaire = getQuestionaire(campaign, questionaire);

    /**
     * Save each indivdual question to the DB.
     */
    questionaire.forEach(async question => {
        await Manager.save(question).catch(e => console.log(e));
    });
};

function getStreetNumber(location) {
    return parseInt(location.split(',')[0]);
};

function getStreet(location) {
    return (location.split(',')[1]).trim();
};

function getUnit(location) {
    let unit = location.split(',')[2];
    if (unit === undefined) {
        return '';
    }
    return unit.trim();
};

function getCity(location) {
    return (location.split(',')[3]).trim();
};

function getState(location) {
    return (location.split(',')[4]).trim();
};

function getZip(location) {
    let zip = (location.split(',')[5]);
    parseInt(zip, 10);  // Necessary to ensure leading 0 is not removed    
    return zip.trim();
};

function constructAddress(location) {
    var address =
        location.streetNumber + " " +
        location.street + ", " +
        location.city + ", " +
        location.state + " " +
        location.zipcode;
    return address;
};

export const saveLocations = async (campaign, locations) => {
    const Manager = getManager();

    locations = locations.trim().split('\n');

    let places = [];
    let address;
    campaign.locations = [];
    for (let i in locations) {
        places.push(new Locations());
        places[i].streetNumber = getStreetNumber(locations[i]);
        places[i].street = getStreet(locations[i]);
        places[i].unit = getUnit(locations[i]);
        places[i].city = getCity(locations[i]);
        places[i].state = getState(locations[i]);
        places[i].zipcode = getZip(locations[i]);

        address = constructAddress(places[i]);
        /**
         * WTF is going on here!?!?
         */
        await googleMapsClient.geocode({ address: address }, async function (err, response) {
            if (!err) {
                var coord = response.json.results[0].geometry.location;
                updateLocation(coord);
            } else {
                return console.log("Geocode not found");
            }
        });
        function updateLocation(coord) {
            places[i].lat = Number(coord.lat);
            places[i].long = Number(coord.lng);
            getManager().save(places[i]);
            return places;
        }
        campaign.locations.push(places[i]);
    }
    await Manager.save(campaign).catch(e => console.log('error saving location', e))
        .catch(e => console.log('Error saving location', e));
};

function getManagers(managers) {
    managers = managers.split("\n");
    for (let i in managers) {
        if (managers[i] === '\r' || managers[i] === ' ' || managers[i] === '') {
            managers.splice(i, 1);
        }
    }

    for (let i in managers) {
        managers[i] = managers[i].replace('\r', '');
    }

    return managers;
};

function getCanvassers(canavassers) {
    canavassers = canavassers.split("\n");
    for (let i in canavassers) {
        if (canavassers[i] === '\r' || canavassers[i] === ' ' || canavassers[i] === '') {
            canavassers.splice(i, 1);
        }
    }

    for (let i in canavassers) {
        canavassers[i] = canavassers[i].replace('\r', '');
    }

    return canavassers;
};

export const saveManagers = async (campaign, managers) => {
    let usr;
    let cm;

    managers = getManagers(managers);

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
                    console.log(`${usr._username} is not a campaign manager`);
                }

            } else {
                console.log(`${managers[i]} does not exist`);
            }

        }
    }
};


export const saveCanavaser = async (campaign, canvassers) => {
    let usr;
    let canvass;
    canvassers = getCanvassers(canvassers);

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
                    console.log(`${usr._username} is not a canvasser`);
                }

            } else {
                console.log(`${canvassers[i]} does not exist`);
            }

        }
    }
    await getManager().save(campaign.canvassers)
        .catch(e => console.log('Error', e));
};
