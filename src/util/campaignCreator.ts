import { Campaign }             from '../backend/entity/Campaign';
import { getManager }           from 'typeorm';
import { Locations }            from '../backend/entity/Locations';
import { Canvasser }            from '../backend/entity/Canvasser';
import { User }                 from '../backend/entity/User';
import { CampaignManager }      from '../backend/entity/CampaignManager';
import * as campaignParser      from './campaignParser';

const winston = require('winston');
const logger = require('../util/logger');
const campaignLogger = winston.loggers.get('campaignLogger');

const googleMapsClient = require('@google/maps').createClient({
    key: 'AIzaSyAkzTbqwM75PSyw0vwMqiVb9eP6NjnClFk',
    Promise: Promise
});


export const emptyCampaign = (campaignID) => {
   return {
    missing: campaignID,
    id: "",
    name: "",
    manager: "",
    assignment: "",
    location: "",
    sDate: "",
    eDate: "",
    duration: "",
    question: "",
    points: "",
    canvasser: ""
   } 
};

export const getDate = date => {
    return campaignParser.getDate(date);
};

export const initCampaign = (name, sDate, eDate, avgDuration) => {
    const newCampaign: Campaign = new Campaign();
    newCampaign.name = name;
    newCampaign.startDate = sDate;
    newCampaign.endDate = eDate;
    newCampaign.avgDuration = avgDuration;
    return newCampaign;
};

export const saveTalkingPoints = (campaign, talkingPoints) => {
    const Manager = getManager();
    talkingPoints = campaignParser.getTalkingPoints(campaign, talkingPoints);

    /**
     * Save each indivdual talking point to the DB.
     */
    talkingPoints.forEach(async point => {
        await Manager.save(point).catch(e => console.log(e));
    });
};


export const saveQuestionaire = (campaign, questionaire) => {
    const Manager = getManager();
    questionaire = campaignParser.getQuestionaire(campaign, questionaire);

    /**
     * Save each indivdual question to the DB.
     */
    questionaire.forEach(async question => {
        await Manager.save(question).catch(e => console.log(e));
    });
};


export const saveManagers = async (campaign, managers) => {
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
};


function createLocation(location) {
    let places = new Locations();
    campaignLogger.info(`Saving ${location}`);
    places.streetNumber = campaignParser.getStreetNumber(location);
    places.street = campaignParser.getStreet(location);
    places.unit = campaignParser.getUnit(location);
    places.city = campaignParser.getCity(location);
    places.state = campaignParser.getState(location);
    places.zipcode = campaignParser.getZip(location);
    return places;
}

export const saveLocations = async (campaign, locations) => {
    const Manager = getManager();

    locations = locations.trim().split('\n');

    let places = [];
    let address;
    let coord;
    campaign.locations = [];
    for (let i in locations) {
        places.push(createLocation(locations[i]));
        address = campaignParser.constructAddress(places[i]);

        await googleMapsClient.geocode({address})
            .asPromise()
            .then(res => {
                coord = res.json.results[0].geometry.location;
                places[i].lat = Number(coord.lat);
                places[i].long = Number(coord.lng);
            })
            .catch(e => console.log('Locations error', e));

        campaign.locations.push(places[i]);
    }
    await Manager.save(campaign.locations);
};


export const saveCanavaser = async (campaign, canvassers) => {
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
};

export const saveCampaign = async campaign => {
    const Manager = getManager();
    await Manager.save(campaign).catch(e => console.log(e));
};

