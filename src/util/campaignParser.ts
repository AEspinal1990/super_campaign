import { Campaign }     from '../backend/entity/Campaign';
import { Questionaire } from '../backend/entity/Questionaire';
import { Locations }    from '../backend/entity/Locations';
import { TalkPoint }    from '../backend/entity/TalkPoint';

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
    let zip = (location.split(',')[5]).trim().replace('\r','');
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


/**
 * Returns the talking points from a campaign object
 */
export const getTalkingPoints = (campaign, talkingPoints) => {
    // Split up points by line breaks and remove carriage returns
    console.log('From talking points', talkingPoints)
    talkingPoints = talkingPoints.trim().split("\n");
    for(let i in talkingPoints) {
        talkingPoints[i] = talkingPoints[i].trim().replace('\r','');
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
 * Returns the questions from a campaign object
 */
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

/**
 * Campaign Specific function
 */
export const initCampaign = (name, sDate, eDate, avgDuration) => {
    const newCampaign: Campaign = new Campaign();
    newCampaign.name = name;
    newCampaign.startDate = sDate;
    newCampaign.endDate = eDate;
    newCampaign.avgDuration = avgDuration;
    return newCampaign;
};



/**
 * Passed a list of users will remove all non user data
 * @param user 
 */
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

export function getManagers(managers) {    
    return sanitizeUsers(managers);    
};

export function getCanvassers(canvassers) {
    return sanitizeUsers(canvassers);
}

/**
 * Given a string parse for date and return it.
 * @param date 
 */
export const getDate = date => {
    date = date.split("-");
    return new Date(date[0], date[1]-1, date[2]);
};





// function to build campaign data
exports.createCampaignInfo = campaignData => {
    let campaignName = campaignData.campaignName;
    let startDate = campaignData.startDate;
    let endDate = campaignData.endDate;
    let averageExpectedDuration = campaignData.averageExpectedDuration;
    startDate = startDate.split("-");
    startDate = new Date(startDate[0], startDate[1], startDate[2]);
    console.log(getDate(campaignData.startDate));
    console.log(startDate);
    endDate = endDate.split("-");
    endDate = new Date(endDate[0], endDate[1], endDate[2]);
    const newCampaign = initCampaign(campaignName,startDate,endDate,averageExpectedDuration);
    // newCampaign.name = campaignName;
    // newCampaign.startDate = startDate;
    // newCampaign.endDate = endDate;
    // newCampaign.avgDuration = averageExpectedDuration;
    return newCampaign;
};
//function to build campaign with locations
exports.createCampaignLocations = campaignData => {
    let locations = campaignData.locations;
    locations = locations.trim().split('\n');
    let allLocations = [];
    for (let i in locations) {
        let newLocation = new Locations();
        newLocation.streetNumber = getStreetNumber(locations[i]);
        newLocation.street = getStreet(locations[i]);
        newLocation.unit = getUnit(locations[i]);
        newLocation.city = getCity(locations[i]);
        newLocation.state = getState(locations[i]);
        newLocation.zipcode = getZip(locations[i]);
        allLocations[i] = newLocation;
    }
    let campaign = exports.createCampaignInfo(campaignData);
    campaign.locations = allLocations;
    return campaign;
};
