import * as fs from 'fs';
import { Canvasser } from '../backend/entity/Canvasser';
import { getManager } from 'typeorm';
import { Task } from '../backend/entity/Task';
import { RemainingLocation } from '../backend/entity/RemainingLocation';
import { AssignedDate } from '../backend/entity/AssignedDate';
import { Locations } from '../backend/entity/Locations';
import { Assignment } from '../backend/entity/Assignment';
import { spawnSync } from 'child_process';
var _ = require('lodash');
var moment = require('moment');
moment().format();

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
    // create a new depot location
    var depot = campaign.locations[0];
    depot.lat = Number(depot.lat);
    depot.long = Number(depot.long);
    
    let locations = [depot];

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
        .where("_ID = ID", { ID: taskId })
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
            location.route = Number(j);

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
    let availableDates = [];
    // Sort by dates to allow for easier front loading.
    canvassers.forEach(canvasser => {
        canvasser.availableDates = sortDates(canvasser.availableDates);

        // all available dates for this canvasser will be the actual available dates
        if (canvasser.assignedDates.length === 0){
            canvasser.assignedDates = [];
            canvasser.task = [];
            availableDates.push(canvasser.availableDates);
        } else {
            /**
             * create a list of available dates by comparing
             * the assigned dates with all inital availablle dates
             */
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

    // check if there are no available dates
    if (availableDates.length == 0){
        return {
            canvasser: null, 
            status: 3
        };
    }

    // From all canvassers find the earliest date and insert task
    let earliestDate;
    let canvasserIndex;
    let status;
    for (let l in tasks) {
        // Since dates are already sorted,
        // earliest date will be at a canvassers first available date.
        for (let i in canvassers) {
            if (availableDates[i] === undefined) {
                continue;
            } else if (availableDates[i].length === 0){
                continue;
            }
            let date = canvassersEarliestDates(availableDates[i]);
            if (date != null){
                if (earliestDate === undefined || date < earliestDate) {
                    canvasserIndex = Number(i);
                    earliestDate = date;
                    status = 4;
                }
            }
            if (Number(i) == canvassers.length -1 && status != 4){
                status = 2;
            }
        }
        if (status == 2){
            earliestDate = undefined;
            continue;
        }
        // Insert into datesAssigned
        canvassers[canvasserIndex] = assignTask(canvassers[canvasserIndex], tasks[l]);
        tasks[l].canvasser = canvassers[canvasserIndex].ID.name;
        tasks[l].scheduledOn = earliestDate;
        for (let m in availableDates[l]){
            // console.log("availDates: ", availableDates[l][m], " earliestDate: ", earliestDate)
            if (+availableDates[l][m].availableDate == +earliestDate){
                console.log("replaced earliestDate: ", availableDates[l][m])
                availableDates[l].splice(m, 1);
                console.log("the dates: ", availableDates[l])
            }
        }
        earliestDate = undefined;
    };
    if (status == 2){
        return {
            canvasser: canvassers,
            status: 2
        };
    }

    return {
        canvasser: canvassers,
        status: 1
    };
};

function assignTask(canvasser: Canvasser, task: Task) {
    // Create AssignedDate object and insert into canvasser
    let assignedDate = new AssignedDate();
    assignedDate.canvasserID = canvasser;
    assignedDate.assignedDate = canvasser.availableDates[0].availableDate
    canvasser.assignedDates.push(assignedDate);
    canvasser.task.push(task);
    task.canvasser = canvasser.ID.name;
    // do not delete the date of the newly assigned from available dates
    // the available dates are a record of all dates canvasser was initally available for
    return canvasser;
}

function canvassersEarliestDates(availableDates) {
    if (availableDates == undefined || availableDates == null){
        return null;
    }
    return availableDates[0].availableDate;
}

function sortDates(availableDates) {
    return _.orderBy(availableDates, (availableDate) => {
        return new moment(availableDate.availableDate);
    });
};

/**
 * Update tasks that already exists in the database
 * @param tasks 
 * @param campaignID 
 * @param canvassers 
 */
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

/**
 * Launches and handles the response of OR-Tools from our python file
 * @param data 
 */
export const launchORT = async (data) => {
    fs.writeFile("src/data/ordata.json", JSON.stringify(data, null, "\t"), function (err) {
        if (err) throw err;
    });

    // start up OR-Tools from child process
    // const { spawn } = require('child_process');
    // const pyORT = spawn('python', ['src/util/ortool.py']);
    let myPromise = new Promise((resolve, reject) => {
        var sys = require('sys')
    var exec = require('child_process').exec;
        let dir = exec("cd src/util && python ortool.py", function(err, stdout, stderr) {
            if (err) {
              reject(err);
            }
        });

        dir.on('exit', function (code) {
            // exit code is code
            let newTasks = fs.readFileSync('src/data/result_tasks.json', 'utf8');
            resolve(newTasks);
        });
    })
    // var sys = require('sys')
    // var exec = require('child_process').exec;

    // let dir = exec("cd src/util && python ortool.py", function(err, stdout, stderr) {
    //     if (err) {
    //       // should have err.code here?  
    //     }
    // });
      
    // dir.on('exit', function (code) {
    // // exit code is code
    // });
    // let newTasks = fs.readFileSync('src/data/result_tasks.json', 'utf8');
    
    let task;
    await myPromise
    .then(res =>  task = res)
    .catch(e => console.log('Fuck!', e))   
    return task;
};


/**
 * Load the rest of the campaigns the canvasser may be in.
 * This is needed for saving the entity, as to not lose previous data
 * @param canvassers
 */
export const loadCanvasserCampaigns = async (canvassers) => {
    for (let l in canvassers){
        var canvass = await getManager()
            .createQueryBuilder(Canvasser, "canvasser")
            .leftJoinAndSelect("canvasser._ID", "user")
            .leftJoinAndSelect("canvasser._campaigns", "campaigns")
            .leftJoinAndSelect("campaigns._assignment", "assignment")
            .where("user._employeeID = :id", {id: canvassers[l].ID.employeeID})
            .getOne();

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

export const getOldAssignment = async (campaignID) => {
    var task = await getManager()
        .createQueryBuilder(Task, "task")
        .leftJoinAndSelect("task._assignment", "assignment")
        .where("task._campaignID = :id", {id: campaignID})
        .getOne()
        .then(res => {
            return res;});
    var assignment;
    if (task != undefined && task != null){
        assignment = await getManager()
            .createQueryBuilder(Assignment, "assignment")
            .where("assignment._ID = :id", {id: task.assignment.ID})
            .getOne()
            .then(res => {
                return res;});
        assignment.tasks = await getManager()
            .createQueryBuilder(Task, "task")
            .leftJoinAndSelect("task._assignment", "assignment")
            .leftJoinAndSelect("task._remainingLocation", "RL")
            .leftJoinAndSelect("RL._locations", "RLocation")
            .where("assignment._ID = :id", {id: assignment.ID})
            .getMany()
            .then(res => {
                return res;});
    }
    return assignment;
};

export const clearAssignment = async (assignment) => {
    // remove locations for each remaining locations
    for (let l in assignment.tasks){
        await removeRLocations(assignment.tasks[l]);
        await getManager()
            .createQueryBuilder()
            .relation(Task, "_remainingLocation")
            .of(assignment.tasks[l].ID)
            .set(null);
        await getManager()
            .createQueryBuilder()
            .delete()
            .from(Task)
            .where("_ID = :id", {id: assignment.tasks[l].ID})
            .execute();
    }
    assignment.task = [];
    return assignment;
};

async function removeRLocations(task){
    for (let l in task.remainingLocation.locations){
        await getManager()
            .createQueryBuilder()
            .relation(RemainingLocation, "_locations")
            .of(task.remainingLocation.ID)
            .remove(task.remainingLocation.locations[l].ID)
    }
};
