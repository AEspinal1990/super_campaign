import * as fs from 'fs';
import { Canvasser } from '../backend/entity/Canvasser';
import { getManager } from 'typeorm';

function getGlobalParams() { 
    let rawdata = fs.readFileSync('src/globals.json');
    // @ts-ignore - [ts] Argument of type 'Buffer' is not assignable to parameter of type 'string'.
    return JSON.parse(rawdata);
}

export const getAvgSpeed = () => {
    let globals = getGlobalParams();
    return Number(globals.averageSpeed);
};

export const getWorkdayLimit = () => {
    let globals = getGlobalParams();
    return Number(globals.taskTimeLimit);
};

export const getCampaignLocations = campaign => {
    let locations = [];
    campaign.locations.forEach(location => locations.push(location));
    return locations
};

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
 * Using the Manhatten Distance formula compute the average
 * distance between all locations. This will help come up
 * with a rough estimate on the number of tasks needed to 
 * canvass all the locations in the current campaign.
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
    let numTask = (avgDistance + avgDuration) / workdayDuration;
    return numTask;
}

function getCoords(location) {
    return [Number(location.lat), Number(location.long)];
};

export const generateTasks = (locations, avgDuration, travelSpeed, workdayDuration) => {
    let duration;
    let coords = []
    // Get all the coordinates
    locations.forEach(location => {
        coords.push(getCoords(location));
    });
    console.log(coords);

};