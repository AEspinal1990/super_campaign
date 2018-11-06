import * as fs                  from 'fs';
import { Canvasser }            from '../backend/entity/Canvasser';
import { getManager }           from 'typeorm';
import { Task }                 from '../backend/entity/Task';
import { RemainingLocation }    from '../backend/entity/RemainingLocation';
import { AssignedDate }         from '../backend/entity/AssignedDate';

var _ = require('lodash');
var moment = require('moment');
moment().format();

const googleMapsClient = require('@google/maps').createClient({
    key: 'AIzaSyAkzTbqwM75PSyw0vwMqiVb9eP6NjnClFk',
    Promise: Promise
});

// Empty "campaign" object we return when user 
// tries to access a page with an invalid campaign id.
export const emptyCampaign = {
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
};



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
export const getAvailableCanvassers = async campaignID => {
    return await getManager()
        .createQueryBuilder(Canvasser, "canvasser")
        .leftJoinAndSelect("canvasser._campaigns", "campaign")
        .leftJoinAndSelect("canvasser._ID", "user")
        .leftJoinAndSelect("canvasser._availableDates", "avaDate")
        .leftJoinAndSelect("canvasser._assignedDates", "assDate")
        .where("campaign._ID = :ID", { ID: campaignID })
        .getMany();
};

export const getCanvassers = async campaignID => {
    return await getManager()
        .createQueryBuilder(Canvasser, "canvasser")
        .leftJoinAndSelect("canvasser._ID", "user")
        .leftJoinAndSelect("canvasser._campaigns", "campaign")
        .leftJoinAndSelect("canvasser._task", "tasks")
        .where("campaign._ID = :ID", { ID: campaignID })
        .getMany();
}



export const getTaskCanvasser = async (taskID, canvasserID) => {
    return await getManager()
        .createQueryBuilder(Canvasser, "canvasser")
        .leftJoinAndSelect("canvasser._tasks", "tasks")
        .where("canvasser._ID = :ID", {ID: canvasserID})
        .where("tasks._ID = ID", {ID: taskID})
        .getMany();
};

/**
 * Returns the tasks for a campaign
 * @param campaignID 
 */
export const getCampaignTask = async (campaignID) => {
    return await getManager()
        .createQueryBuilder(Task, "task")
        .where("campaignID = :ID", { ID: campaignID })
        .getMany();
}


export const getTask = async (taskId) => {
    return await getManager()
        .createQueryBuilder(Task, "task")
        .where("ID = ID", {ID: taskId})
        .getMany();
}

export const getRemainingLocations = async taskID => {
    return await getManager()
        .createQueryBuilder(RemainingLocation, "remainingLocation")
        .leftJoinAndSelect("remainingLocation._locations", "locations")
        .where("remainingLocation._ID = :ID", { ID: taskID })
        .getMany();
}

/**
 * Code Sniplet has been obtained from https://www.movable-type.co.uk/scripts/latlong.html
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
    return {lat : Number(location.lat), lng: Number(location.long)};
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
export const generateTasks = async (locations, avgDuration, travelSpeed, workday) => {
    
    let remainingLocations = [];
    let t = [];
    let coords = []
    let tripTime;
    let mode;
    let durOfTask = 0;
    let i = 0;

    // Get all the coordinates
    locations.forEach(location => {
        coords.push(getCoords(location));
    });

    // Determine mode of transportation based off 
    // of travelSpeed in mph - walk, bike, or car
    mode = determineModeOfTransportation(travelSpeed);    
    
    // Create arrays of remainingLocations that are properties of
    // a task.  
    let times = [];  
    let taskTime = 0;
    while(coords.length > 1) {
        tripTime = await getTripTime(coords[i], coords[i+1], mode, avgDuration);
        
        // A to B fits in workday
        if (tripTime + durOfTask <= workday) {
            remainingLocations.push(locations[i]);
            durOfTask += tripTime;
            locations.shift();
            coords.shift();
            taskTime += tripTime;
        }
        // Getting to B takes longer than workday.
        // Make a single Task into a business trip
        else if(tripTime > workday) {
            remainingLocations.push(locations[i]);

            t.push(remainingLocations);
            remainingLocations = [];
            taskTime = 0;
            times.push(taskTime);
            t.push([locations[i+1]]);
            times.push(tripTime);
            locations.shift();
            coords.shift();
        }
        // Adding A to B would exceed workday
        // Stop at A make B part of the next task
        else {
            remainingLocations.push(locations[i]);
            times.push(taskTime);
            t.push(remainingLocations);      
            remainingLocations = [];
            durOfTask = 0;
            locations.shift();
            coords.shift();
            
            taskTime = 0;
        }        
        //console.log('Time', taskTime)

    }

    // Enter the remaining locations into a task.
    if (remainingLocations.length > 0) { 
        t.push(remainingLocations);
        times.push(taskTime);
        remainingLocations = [];
    }
    
    // Create tasks
    let tasks = [];
    t.forEach(task => tasks.push(createTask(task, times.pop())));

    return tasks;

};

/**
 * Returns a Task object with only the remainingLocations, status,
 * and scheduledOn properties assigned.
 * @param remainingLocations 
 */
function createTask(remainingLocations, time) {
    //console.log(time)
    let task = new Task();
    task.remainingLocation = new RemainingLocation();
    task.remainingLocation.locations = remainingLocations;
    task.numLocations = task.remainingLocation.locations.length;
    task.status = false;
    task.scheduledOn = new Date();
    task.duration = time;
    return task;
}

/**
 * Decorates a Task object with its campaignID,
 * currentLocation, and completedLocatoin.
 * @param task 
 * @param campaign 
 */
export const decorateTask = (task, campaign) =>{
    task.campaignID = Number(campaign.ID);
    //task.currentLocation = task.remainingLocation.locations[0];
    
    return task;
}


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

export const removeBusy = (canvassers: Canvasser[]) => {

    let availableCanvassers = [];

    canvassers.forEach(canvasser => {
        if(canvasser.availableDates.length !== 0){
            availableCanvassers.push(canvasser)
        }
    });

    return availableCanvassers;
}

export const assignTasks = (canvassers: Canvasser[], tasks: Task[]) => {

    // Sort by dates to allow for easier front loading.
    canvassers.forEach(canvasser => {
        canvasser.availableDates = sortDates(canvasser.availableDates);
        canvasser.assignedDates = [];
        canvasser.task = [];
    });

    
    // From all canvassers find the earliest date and insert task
    let earliestDate;
    let canvasserIndex;
    tasks.forEach(task => {
        // Since dates are already sorted earliest date will
        // be at a canvassers first available date.
        for (let i in canvassers) {
            //console.log(i , canvassers[i].availableDates)
            //TODO: HOTFIX - This needs to be reworked.
            if(canvassers[i].availableDates.length === 0){
                continue;
            }
            let date = canvassersEarliestDates(canvassers[i].availableDates);
            //console.log(date);
            if (earliestDate === undefined || date < earliestDate) {
                canvasserIndex = i;
                earliestDate = canvassers[i].availableDates[0].availableDate;
            }            
        }

        // Found earliest date remove them from canvassers available list
        // Insert into datesAssigned    
        canvassers[canvasserIndex] = assignTask(canvassers[canvasserIndex], task);
        earliestDate = undefined;        
    });
    
    
    return canvassers;
};

export const findDuration = async (task, campaign) => {
    //console.log('****Starts here', task.remainingLocations);

    let locations = task.remainingLocations;    
    let travelSpeed = this.getAvgSpeed();
    let avgDuration = campaign._avgDuration;
    let coords = [];
    let mode;
    let tripTime;
    let i = 0;
    //console.log('here', locations)
    // Get all the coordinates
    locations.forEach(async location => {
        await coords.push(getCoords(location));
    });

    // Determine mode of transportation based off 
    // of travelSpeed in mph - walk, bike, or car
    mode = determineModeOfTransportation(travelSpeed);    

    // Calculate time itll take to canvass all locations in this task   
    while(coords.length > 1) {
        tripTime = await getTripTime(coords[i], coords[i+1], mode, avgDuration);        
        coords.shift();
        task.duration += tripTime;
    }

    return task;
}


function assignTask(canvasser: Canvasser, task: Task) {

    // Create AssignedDate object and insert into canvasser    
    let assignedDate = new AssignedDate();
    assignedDate.canvasserID = canvasser;
    assignedDate.assignedDate = canvasser.availableDates[0].availableDate
    canvasser.assignedDates.push(assignedDate);

    // Remove date that was just assigned from available dates
    canvasser.availableDates.shift();
    canvasser.task.push(task);
    task.canvasser = canvasser.ID.name;

    return canvasser;
}

function canvassersEarliestDates(availbleDates) {    
    //console.log('Dates', availbleDates[0].availableDate)
    return availbleDates[0].availableDate;    
}

function sortDates(availableDates) {
    return _.orderBy(availableDates, (availableDate) => {
        return new moment(availableDate.availableDate);
    });
};