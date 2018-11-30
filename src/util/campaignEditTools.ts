import { getManager, getRepository } from "typeorm";
import { Campaign } from "../backend/entity/Campaign";
import { TalkPoint } from "../backend/entity/TalkPoint";
import { Questionaire } from "../backend/entity/Questionaire";
import { Locations } from "../backend/entity/Locations";
import { CampaignManager } from "../backend/entity/CampaignManager";
import { User } from "../backend/entity/User";
import { Canvasser } from "../backend/entity/Canvasser";
import * as campaignParser      from './campaignParser';
const logger = require('../util/logger');
const campaignLogger = logger.getLogger('campaignLogger');
const googleMapsClient = require('@google/maps').createClient({
    key: 'AIzaSyAkzTbqwM75PSyw0vwMqiVb9eP6NjnClFk'
});

export const initCampaign = updatedCampaign => {
    let properties;
    let startDate: Date;
    let endDate: Date;
    let avgDuration: number;
    let talkingPoints: TalkPoint[];
    let questions: Questionaire[];
    let managers: CampaignManager[];
    let canvassers: Canvasser[];
    let locations: Location[];


    
    startDate = campaignParser.getDate(updatedCampaign.startDate);
    endDate = campaignParser.getDate(updatedCampaign.endDate);
    avgDuration = Number(updatedCampaign.averageExpectedDuration);

    // Create Campaign Object
    const campaign: Campaign = new Campaign();
    
    // Parse the talking points
    talkingPoints = campaignParser.getTalkingPoints(campaign, updatedCampaign.talkingPoints);

    // Parse the questionnaire
    questions = campaignParser.getQuestionnaire(campaign, updatedCampaign.questionaire)
    
    // Parse the Campaign Managers
    managers = campaignParser.getManagers(updatedCampaign.managers);
    
    // Parse the Canvassers
    canvassers = campaignParser.getCanvassers(updatedCampaign.canvassers);

    // Parse the locations
    locations = campaignParser.getLocations(updatedCampaign.locations)

    // Decorate Campaign object
    campaign.name = updatedCampaign.campaignName;
    campaign.startDate = startDate;
    campaign.endDate = endDate;
    campaign.avgDuration = avgDuration;
    campaign.talkingPoint = talkingPoints;
    campaign.question = questions;
    campaign.managers = managers;
    
    
    return [updatedCampaign.campaignName, startDate, endDate, avgDuration, 
        talkingPoints, questions, managers];
}

export const compareNames = (originalname, updatedName) => {
    console.log(originalname)
    console.log(updatedName)
    return (originalname === updatedName);
}

export const compareDates = (originalDate, updatedDate) => { 
    let date: Date = campaignParser.getDate(updatedDate);
    originalDate = date.getFullYear() + "-" 
        + (date.getMonth() + 1) + "-" 
        + date.getDate();
    return (originalDate === updatedDate);
}


export const compareAvgDurations = (originalAvgDuration, updatedAvgDuration) => {
    console.log(originalAvgDuration + " vs " + updatedAvgDuration)
    return (originalAvgDuration == updatedAvgDuration)
}

export const updatedDate = (updatedDate) => {
    return campaignParser.getDate(updatedDate);
}

export const updateTalkingPoints = async (campaign, talkingPoints) => {
    talkingPoints = campaignParser.getTalkingPoints(campaign, talkingPoints);

    /**
     * Delete original talking points
     */
    await getRepository(TalkPoint)
        .createQueryBuilder()
        .delete()
        .where("_campaign = :ID", { ID: campaign._ID })
        .execute();

    /**
     * Save each indivdual talking point to the DB.
     */
    talkingPoints.forEach(async point => {
        await getManager().save(point).catch(e => console.log(e));
    });
}

export const updateQuestionnaire = async (campaign, questionaire) => {
    questionaire = campaignParser.getQuestionnaire(campaign, questionaire);

    /**
     * Delete original questions
     */
    await getRepository(Questionaire)
        .createQueryBuilder()
        .delete()
        .where("_campaign = :ID", { ID: campaign._ID })
        .execute();

    /**
     * Update the questions in the DB.
     */
    questionaire.forEach(async question => {
        await getManager().save(question).catch(e => console.log(e));
    });
}


export const updateManagers = async (campaign, managers) => {
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
    campaignLogger.info(`Updating managers for: ${campaign.name}`);
    await getManager().save(campaign).catch(e => console.log(e));
}


export const updateCanvassers = async (campaign, updatedCanvassers) => {


    // Remove current canvassers from campaign
    
    let canvassers = await getManager()
        .createQueryBuilder(Canvasser, "canvasser")
        .leftJoinAndSelect("canvasser._campaigns", "campaign")
        .leftJoinAndSelect("canvasser._ID", "user")
        .where("campaign._ID = :ID", { ID: campaign._ID })
        .getMany();
    canvassers.forEach( async canvasser => {
        await getManager()
            .createQueryBuilder()
            .relation(Canvasser, "_campaigns")
            .of(canvasser.ID.employeeID)
            .remove(campaign._ID)
            .then(res => console.log(res))
            .catch(e => console.log(e))
    });
    

    let usr;
    let canvass;
    canvassers = campaignParser.getCanvassers(updatedCanvassers);
    campaign.canvassers = [];
    
    for (let i in canvassers) {
        
        usr = await getManager().findOne(User, { where: { "_employeeID": canvassers[i] } });
        canvass = await getManager().findOne(Canvasser, { where: { "_ID": usr } });
        if (usr === undefined) {
            campaignLogger.warn(`User with id ${canvassers[i]} does not exist`);
            
        } else if (canvass === undefined) {
            campaignLogger.warn(`${usr._username} is not a canvasser`);
        } else {
            campaign.canvassers.push(canvass);
            canvass.campaigns.push(campaign);
        }
    }
    campaignLogger.info(`Updating Canvassers for ${campaign.name}`);
    await getManager().save(campaign.canvassers)
        .catch(e => console.log('Error', e));
}

export const updateLocations = (campaign, updatedLocations) => {
    let places = [];
    let removals = [];
    let insertions = [];
    let originalLocations = campaign.locations;

    
    // Parse the updated list of locations
    updatedLocations = updatedLocations.trim().split('\n');    
    updatedLocations.forEach(location => {
        places.push(createLocation(location))
    })
    
    // Check which locations need to be inserted
    // If place is not found in originalLocations it must
    // be new therefore add into array of locations to insert
    for(let i in places) {
        if(!locationFound(places[i], originalLocations)) {
            insertions.push(places[i])
        }
    }
    console.log('Inserting the locations:', insertions)
    // Check which locations need to be deleted
    // If original locations are not found in updated list then
    // they must have been removed therefore add to array of locations
    // to delete
    for(let i in originalLocations) {
        if(!locationFound(originalLocations[i], places)) {
            removals.push(originalLocations[i])
        }
    }
    
    console.log('Removing the locations', removals)
       

}

function locationFound(targetLocation, listOfLocations) {


    for(let i in listOfLocations) {
        if(locationsMatch(targetLocation, listOfLocations[i])) {
            return true;
        }
    }

    return false;
}

function locationsMatch(targetLocation, location) {

    // Compare street numbers
   
    if (targetLocation._streetNumber !== location._streetNumber) {
        return false;
    } 
    
    // compare streets
    if (targetLocation._street !== location._street) {
        return false;
    }
    
    // compare unit
    if (targetLocation._unit !== location._unit) {
        return false;
    }
    
    // compare city
    if (targetLocation._city !== location._city) {
        return false;
    }
    
    // // compare state
    if (targetLocation._state !== location._state) {
        return false;
    }
    
    // compare zipcode
    if (targetLocation._zipcode != location._zipcode) {
        return false;
    }
    return true;
}

function createLocation(location) {
    let places = new Locations();
    places.streetNumber = campaignParser.getStreetNumber(location);
    places.street = campaignParser.getStreet(location);
    places.unit = campaignParser.getUnit(location);
    places.city = campaignParser.getCity(location);
    places.state = campaignParser.getState(location);
    places.zipcode = campaignParser.getZip(location);
    return places;
}