import { Campaign }         from '../backend/entity/Campaign';
import { getManager }       from 'typeorm';
import { Questionaire }     from '../backend/entity/Questionaire';
import { Locations }        from '../backend/entity/Locations';
import { Canvasser }        from '../backend/entity/Canvasser';
import { TalkPoint }        from '../backend/entity/TalkPoint';
import { User }             from '../backend/entity/User';
import { CampaignManager }  from '../backend/entity/CampaignManager';
import * as campaignParser  from './campaignParser';

const googleMapsClient = require('@google/maps').createClient({
    key: 'AIzaSyAkzTbqwM75PSyw0vwMqiVb9eP6NjnClFk',
    Promise: Promise
});


export const saveCampaign = async (name, sDate, eDate, avgDuration) => {
    const campaign = campaignParser.initCampaign(name, sDate, eDate, avgDuration);
    const Manager = getManager();
    await Manager.save(campaign).catch(e => console.log(e));
    return campaign;
};

export const getDate = date => {
    date = date.split("-");
    return new Date(date[0], date[1], date[2]);
};


export const saveTalkingPoints = (campaign, talkingPoints) => {   
    const Manager = getManager();
    talkingPoints = campaignParser.getTalkingPoints(campaign, talkingPoints);

    /**
     * Save each indivdual talking point to the DB.
     */
    talkingPoints.forEach( async point => {
        await Manager.save(point).catch(e => console.log(e));
    });
};

export const saveQuestionaire = (campaign, questionaire) => {
    const Manager = getManager();
    questionaire = campaignParser.getQuestionaire(campaign, questionaire);

    /**
     * Save each indivdual question to the DB.
     */
    questionaire.forEach( async question => {
        await Manager.save(question).catch(e => console.log(e));
    });
};

export const saveLocations = async (campaign, locations) => {
    const Manager = getManager();

    locations = locations.trim().split('\n');
    //console.log(locations)
    let places = [];
    let address;
    for(let i in locations) {
        places.push(new Locations());
        places[i].streetNumber = campaignParser.getStreetNumber(locations[i]);
        places[i].street = campaignParser.getStreet(locations[i]);
        places[i].unit = campaignParser.getUnit(locations[i]);
        places[i].city = campaignParser.getCity(locations[i]);
        places[i].state = campaignParser.getState(locations[i]);
        places[i].zip = campaignParser.getZip(locations[i]);

        address = campaignParser.constructAddress(places[i]);
        console.log(places[i]);
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
            console.log('Saving locations ', campaign.locations)
            Manager.save(places[i]).catch(e => console.log(e));
        });
        
    }
    return places;    
};

export const saveManagers = async (campaign, managers) => {
    const Manager = getManager();
    let usr;
    let cm;

    managers = campaignParser.getManagers(managers);  

    campaign.managers = [];
    for (let i in managers) {
        if (managers[i] != "") {
            usr = await getManager()
                .findOne(User, { where: { "_employeeID": managers[i] } });
            
            // If user exist
            if(usr !== undefined){
                cm = await getManager()
                    .findOne(CampaignManager, { where: { "_ID": usr } });

                // If user is a campaign manager
                if(cm !== undefined){
                    campaign.managers.push(cm);
                } else {
                    console.log(`${usr._username} is not a campaign manager`);
                }
                
            } else {
                console.log(`${managers[i]} does not exist`);
            }            
        }
    }
    await Manager.save(campaign);
};

export const saveCanavaser = async (campaign, canvassers) => {
    const Manager = getManager();
    let usr;
    let can;
    canvassers = campaignParser.getCanvassers(canvassers);

    campaign.canvassers = [];
    for (let i in canvassers) {
        if (canvassers[i] != "") {
            usr = await getManager()
                .findOne(User, { where: { "_employeeID": canvassers[i] } })
            
            // If user exist
            if(usr !== undefined) {
                can = await getManager()
                    .findOne(Canvasser, { where: { "_ID": usr } });

                // If canvasser exist
                if(can !== undefined) {
                    campaign.canvassers.push(can);
                } else {
                    console.log(`${usr._username} is not a canvasser`);
                }
            } else {
                console.log(`${canvassers[i]} does not exist`);
            }
        }
    }
    console.log(campaign)
    await Manager.save(campaign);
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