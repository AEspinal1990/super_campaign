import * as fs from 'fs';
import { Canvasser } from '../backend/entity/Canvasser';
import { getManager } from 'typeorm';
const googleMapsClient = require('@google/maps').createClient({
    key: 'AIzaSyAkzTbqwM75PSyw0vwMqiVb9eP6NjnClFk',
    Promise: Promise
});

/**
 * Trip object used to help with creation of task
 * 
 * @param origin 
 * @param destination 
 * @param tripTime 
 */
function Trip(origin, destination, tripTime) {
    this.origin = origin;
    this.destination = destination;
    this.tripTime = tripTime;
}


/**
 * Retrieves the global parameters set by admin
 */
function getGlobalParams() { 
    let rawdata = fs.readFileSync('src/globals.json');
    // @ts-ignore - [ts] Argument of type 'Buffer' is not assignable to parameter of type 'string'.
    return JSON.parse(rawdata);
}


/**
 * Returns campaign average speed to manager
 */
export const getAvgSpeed = () => {
    let globals = getGlobalParams();
    return Number(globals.averageSpeed);
};


/**
 * Returns length of workday to manager
 */
export const getWorkdayLimit = () => {
    let globals = getGlobalParams();
    return Number(globals.taskTimeLimit);
};

/**
 * Returns the locations for a campaign
 * @param campaign 
 */
export const getCampaignLocations = campaign => {
    let locations = [];
    campaign.locations.forEach(location => locations.push(location));
    return locations
};


/**
 * Returns the canvassers that are available to work on
 * a campaign
 * @param campaignID 
 */
export const getAvailableCanvassers = async (campaignID) => {
    return await getManager()
    .createQueryBuilder(Canvasser, "canvasser")
    .leftJoinAndSelect("canvasser._campaigns", "campaign")
    .leftJoinAndSelect("canvasser._ID", "user")
    .leftJoinAndSelect("canvasser._availableDates", "avaDate")
    .leftJoinAndSelect("canvasser._assignedDates", "assDate")
    .where("campaign._ID = :ID", { ID: campaignID })
    .getMany();
};

/**
 * Calculates the Manhattan Distance between two locations.
 * @param coord1 
 * @param coord2 
 * @param coord3 
 * @param coord4 
 */
export const manhattanDist = (coord1: number, coord2: number, coord3: number, coord4: number): number => {
    // or we can just use google map geometry api... 
    let R = 3958.755866; // miles
    let t1 = coord1 * Math.PI / 180;
    let t2 = coord3 * Math.PI / 180;
    let t3 = (coord3 - coord1) * Math.PI / 180;
    let t4 = (coord4 - coord2) * Math.PI / 180;

    let a = Math.sin(t3 / 2) * Math.sin(t3 / 2) +
        Math.cos(t1) * Math.cos(t2) *
        Math.sin(t4 / 2) * Math.sin(t4 / 2);
    let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    let d = R * c;
    return d;
}

/**
 * Returns an estimation on the number of task necessary to completely canvass
 * all locations
 * @param locations 
 * @param avgDuration 
 * @param travelSpeed 
 * @param workdayDuration 
 */
export const estimateTask = (locations, avgDuration, travelSpeed, workdayDuration) => {
    let avgDistance = 0;
    locations.forEach(location => {
        let avgSingleDistance = 0;

        // find the average distance from all other locations
        locations.forEach(otherLocation => {            
            // find avg distance from locations object
            avgSingleDistance += 
                manhattanDist(location.lat, location.long, otherLocation.lat, otherLocation.long) / travelSpeed;
        });


        avgSingleDistance /= locations.length;
        avgDistance += avgSingleDistance;
    });

    avgDistance /= locations.length;
    let numTask = (avgDistance + avgDuration) / (workdayDuration/60);
    return numTask;
}


/**
 * Returns the coordinates of a location
 * @param location 
 */
function getCoords(location) {
    return [Number(location.lat), Number(location.long)];
};

export function getCoords2(location) {
    return [Number(location.lat), Number(location.long)];
};

/**
 * Based of the travel speed set by an admin
 * the mode of transportation of a canvasser is
 * determined.
 * @param travelSpeed 
 */
function determineModeOfTransportation(travelSpeed) {
    if (travelSpeed <= 3) {
        return 'walking'
    } else if (travelSpeed <= 15) {
        return 'bicycling'
    } else {
        return 'driving'
    }
}

/**
 * Generates the tasks that compose a campaign assignment.
 * @param locations 
 * @param avgDuration 
 * @param travelSpeed 
 * @param workdayDuration 
 */
export const generateTasks = async (locations, avgDuration, travelSpeed, workdayDuration) => {
    
    let trips = [];
    let coords = []
    let tripTime;
    let mode;

    // Get all the coordinates
    locations.forEach(location => {
        coords.push(getCoords(location));
    });

    // Determine mode of transportation based off 
    // of travelSpeed in mph - walk, bike, or car
    mode = determineModeOfTransportation(travelSpeed);    

    // Calculate the time it takes to get from starting location
    // to the next and repeat untill all locations are visited.
    for(let i = 0; i < coords.length - 1; i++) {
        tripTime = await getTripTime(coords[i], coords[i+1], mode, avgDuration);
        trips.push(new Trip(locations[i], locations[i+1], tripTime));        
    }
    
    trips.forEach(trip => {
        console.log(trip);
    });
};

/**
 * Gets the total trip time from location A to location B
 * @name getTripTime
 * @function
 * @param coord1 
 * @param coord2 
 * @param mode 
 * @param avgDuration 
 */
async function getTripTime(coord1, coord2, mode, avgDuration) {
    let tripTime;
    await googleMapsClient.directions({
        origin: coord1, 
        destination: coord2,
        mode
    })
    .asPromise()
    .then(res => tripTime = res)
    .catch(e => console.log(e));

    tripTime = parseTripDuration(tripTime.json.routes[0].legs[0].duration.text);
    tripTime += (avgDuration*2); 
    return tripTime;
}


// TODO: BREAK THIS UP
/**
 * Given a results string from the Google API
 * returns the expected time it takes to travel from
 * location A to location B.
 * @param duration 
 */
function parseTripDuration(duration) {
    //console.log('Dur: ', duration)
    let time = duration.split(" ");
    if(time.length === 2) {
        time = Number(time[0]);
    } else if(time.length === 4) {
        if(time[1] === 'days'){
            time = Number(time[0]) * (24*60) + Number(time[2]) * 2;
        } else {
            time = Number(time[0]) * 60 + Number(time[2]);
        }
        
    } else {
        console.log(`NOTICE: time.length of ${time.length} detected`);
    }
    return time;
}