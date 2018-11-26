import * as fs from 'fs';
import { Canvasser } from '../backend/entity/Canvasser';
import { getManager } from 'typeorm';
import { Task } from '../backend/entity/Task';
import { RemainingLocation } from '../backend/entity/RemainingLocation';
import { AssignedDate } from '../backend/entity/AssignedDate';
import { Locations } from '../backend/entity/Locations';

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
    campaign.locations.forEach(location => {
        location.lat = Number(location.lat);
        location.long = Number(location.long);
        locations.push(location);
    });
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
        .leftJoinAndSelect("canvasser._task", "task")
        .leftJoinAndSelect("task._remainingLocation", "RL")
        .leftJoinAndSelect("RL._locations", "RLocation")
        .leftJoinAndSelect("task._completedLocation", "CL")
        .leftJoinAndSelect("CL._locations", "CLocation")
        .leftJoinAndSelect("task._assignment", "assignment")
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
        .where("canvasser._ID = :ID", { ID: canvasserID })
        .where("tasks._ID = ID", { ID: taskID })
        .getMany();
};

/**
 * Returns the tasks for a campaign
 * @param campaignID 
 */
export const getCampaignTask = async (campaignID) => {
    return await getManager()
        .createQueryBuilder(Task, "task")
        .leftJoinAndSelect("task._remainingLocation", "rL")
        .leftJoinAndSelect("rL._locations", "locations")
        .where("campaignID = :ID", { ID: campaignID })
        .getMany();
}


export const getTask = async (taskId) => {
    return await getManager()
        .createQueryBuilder(Task, "task")
        .where("ID = ID", { ID: taskId })
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
    let R = 6371e3; // meters
    let t1 = coord1 * Math.PI / 180;
    let t2 = coord3 * Math.PI / 180;
    let t3 = Math.abs(coord3 - coord1) * Math.PI / 180;
    let t4 = Math.abs(coord4 - coord2) * Math.PI / 180;

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
    let numTask = (avgDistance + avgDuration) / (workdayDuration / 60);
    return Math.ceil(numTask);
}


/**
 * Returns the coordinates of a location
 * @param location 
 */
export function getCoords2(location) {
    return { lat: Number(location.lat), lng: Number(location.long) };
};


/**
 * Return a list of created Tasks 
 * @param task 
 * @param campaign 
 */
export const createTasks = (routes, campaign, assignment) => {
    let tasks: Task[] = [];
    for (let l in routes) {
        let task = new Task();
        task.remainingLocation = new RemainingLocation();
        task.remainingLocation.locations = [];
        // hard code from json array 'locations' because every indice has a {}
        for (let j in routes[l].locations) {
            let location = new Locations();
            location.ID = routes[l].locations[j]._ID;
            location.streetNumber = routes[l].locations[j]._streetNumber;
            location.street = routes[l].locations[j]._street;
            location.unit = routes[l].locations[j]._unit;
            location.city = routes[l].locations[j]._city;
            location.state = routes[l].locations[j]._state;
            location.zipcode = routes[l].locations[j]._zipcode;
            location.lat = routes[l].locations[j]._lat;
            location.long = routes[l].locations[j]._long;
            task.remainingLocation.locations.push(location);
        }
        task.numLocations = task.remainingLocation.locations.length;
        task.status = false;
        task.campaignID = campaign.ID;
        task.duration = campaign.avgDuration;
        task.assignment = assignment;
        task.scheduledOn = new Date();
        tasks.push(task);
    };
    return tasks;
};

/**
 * Decorates a Task object with its campaignID,
 * currentLocation, and completedLocatoin.
 * @param task 
 * @param campaign 
 */
export const decorateTask = (task, campaign) => {
    task.campaignID = Number(campaign.ID);
    //task.currentLocation = task.remainingLocation.locations[0];

    return task;
}

export const removeBusy = (canvassers: Canvasser[]) => {
    let availableCanvassers = [];
    canvassers.forEach(canvasser => {
        if (canvasser.availableDates.length !== 0) {
            availableCanvassers.push(canvasser)
        }
    });

    return availableCanvassers;
}

export const assignTasks = (canvassers: Canvasser[], tasks: Task[]) => {
    let result;
    let availableDates = [];
    console.log('Canvassers at start', canvassers)
    // Sort by dates to allow for easier front loading.
    canvassers.forEach(canvasser => {
        console.log(canvasser);
        canvasser.availableDates = sortDates(canvasser.availableDates);
        if (canvasser.assignedDates.length === 0){
            canvasser.assignedDates = [];
            canvasser.task = [];
            availableDates.push(canvasser.availableDates);
        } else {
            var date = [];
            canvasser.availableDates.forEach(vdate => {
                for (let l in canvasser.assignedDates) {
                    if (vdate.availableDate == canvasser.assignedDates[l].assignedDate){
                        break;
                    }
                    if (Number(l) == canvasser.assignedDates.length-1) {
                        date.push(vdate);
                    }
                }
            });
            availableDates.push(date);
        }
    });
    // From all canvassers find the earliest date and insert task
    let earliestDate;
    let canvasserIndex;
    tasks.forEach(task => {
        // Since dates are already sorted earliest date will
        // be at a canvassers first available date.
        for (let i in canvassers) {
            if (availableDates[i] === undefined) {
                continue;
            } else if (availableDates[i].length === 0){
                continue;
            }
            let date = canvassersEarliestDates(availableDates[i]);
            if (earliestDate === undefined || date < earliestDate) {
                canvasserIndex = Number(i);
                earliestDate = date;
            }
        }

        // Found earliest date remove them from canvassers available list
        // Insert into datesAssigned    
        // console.log(canvassers[canvasserIndex])
        canvassers[canvasserIndex] = assignTask(canvassers[canvasserIndex], task);
        task.canvasser = canvassers[canvasserIndex].ID.name;
        task.scheduledOn = earliestDate;
        earliestDate = undefined;
    });


    return canvassers;
};

function assignTask(canvasser: Canvasser, task: Task) {
    // Create AssignedDate object and insert into canvasser    
    console.log('The canvasser', canvasser)
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

export const updateTasks = async (tasks, campaignID, canvassers) => {
    let dbTasks = await getCampaignTask(campaignID);
    // we can assume the campaign will have the tasks at this point
    dbTasks.forEach(dbTasks => {
        var found = false;

        for (let i in tasks) {
            // if the locationID matches, it is the same task. Update taskID
            for (let j in tasks[i].remainingLocation.locations) {
                if (tasks[i].remainingLocation.locations[j].ID ==
                    dbTasks.remainingLocation.locations[0].ID) {
                    tasks[i].ID = dbTasks.ID;
                    found = true;
                    break;
                }
            }

            if (found) {
                break;
            }
        }
    });

    return tasks;
};

export const launchORT = (data) => {
    fs.writeFile("src/data/ordata.json", JSON.stringify(data, null, "\t"), function (err) {
        if (err) throw err;
    });

    // start up OR-Tools from child process
    const { spawn } = require('child_process');
    const pyORT = spawn('python', ['src/util/ortool.py']);

    // take a look at ../data/result-tasks.json for structure
    // result from OR-Tools is only a list of new tasks and its' route. no canavassers are assigned
    let newTasks = fs.readFileSync('src/data/result_tasks.json', 'utf8');

    return newTasks;
};

export const loadCanvasserCampaigns = async (canvassers) => {
    for (let l in canvassers){
        var canvass = await getManager()
            .createQueryBuilder(Canvasser, "canvasser")
            .leftJoinAndSelect("canvasser._ID", "user")
            .leftJoinAndSelect("canvasser._campaigns", "campaigns")
            .where("user._employeeID = :id", {id: canvassers[l].ID.employeeID})
            .getOne();
        console.log(canvass)
        if (canvass != undefined){
            for (let m in canvass.campaigns){
                if (canvass.campaigns[m].ID == canvassers[l].campaigns[0].ID)
                    continue;
                canvassers[l].campaigns.push(canvass.campaigns[m]);
            }
        }
    }
    return canvassers;
};
