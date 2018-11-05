import { Campaign } from '../backend/entity/Campaign';
import { Questionaire } from '../backend/entity/Questionaire';
import { Locations } from '../backend/entity/Locations';
import { Canvasser } from '../backend/entity/Canvasser';
import { TalkPoint } from '../backend/entity/TalkPoint';
import { User } from '../backend/entity/User';
import { CampaignManager } from '../backend/entity/CampaignManager';


/**
 * Location Specific functions 
 */

export function getStreetNumber(location) {
    return parseInt(location.split(',')[0]);
};

export function getStreet(location){
    return (location.split(',')[1]).trim();
};

export function getUnit(location) {
    let unit = location.split(',')[2];
    if(unit === undefined){
        return '';
    }
    return unit.trim();
};

export function getCity(location) {
    return (location.split(',')[3]).trim();
};

export function getState(location) {
    return (location.split(',')[4]).trim();
};

export function getZip(location) {
    let zip = (location.split(',')[5]);
    parseInt(zip, 10);  // Necessary to ensure leading 0 is not removed    
    return zip;
};

export function constructAddress(location){
    var address =
        location.streetNumber + " " +
        location.street + ", " +
        location.city + ", " +
        location.state + " " +
        location.zipcode;
    return address;

};

export const getTalkingPoints = (campaign, talkingPoints) => {
    // Split up points by line breaks and remove carriage returns
    talkingPoints = talkingPoints.trim().split("\n");
    for(let i in talkingPoints) {
        talkingPoints[i] = talkingPoints[i].replace('\r','');
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


/**
 * Campaign Specific functions
 */

export const initCampaign = (name, sDate, eDate, avgDuration) => {
    const newCampaign: Campaign = new Campaign();
    newCampaign.name = name;
    newCampaign.startDate = sDate;
    newCampaign.endDate = eDate;
    newCampaign.avgDuration = avgDuration;
    return newCampaign;
};


export function getManagers(managers) {
    sanitizeUsers(managers);
};


export function sanitizeUsers(user) {
    /**
     * Splits by \n then removes \r's
     */
    user = user.split("\n");
    for(let i in user) {
        if(user[i] === '\r' || user[i] === ' ' ||user[i] === '' ){
            user.splice(i,1);
        }
    }
    for(let i in user) {
        user[i] = user[i].replace('\r','');
    }
    return user;
}


export function getCanvassers(canvassers) {
    return sanitizeUsers(canvassers);
}


export const getQuestionaire = (campaign, questionaire) => {
    questionaire = questionaire.trim().split("\n");
    for(let i in questionaire) {
        questionaire[i] = questionaire[i].replace('\r','');
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

export const getDate = date => {
    date = date.split("-");
    return new Date(date[0], date[1]-1, date[2]);
};
