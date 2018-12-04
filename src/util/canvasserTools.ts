import { Results } from '../backend/entity/Results';
import { io } from '../server';
import * as canvasserRepo from '../repositories/canvasserRepo';


export const getResults = async (task, campaignID) => {
    var res = [];
    var results = await canvasserRepo.getResults(campaignID);

    for (let l in results) {
        if (results[l].completedLocation.ID == task.completedLocation.ID) {
            res = res.concat(task.completedLocation.results);
        }
    }

    return task.completedLocation.results;
}

export const findTask = (tasks, locationID) => {
    var task;

    for (let l in tasks) {
        if (tasks[l].remainingLocation != null || tasks[l].remainingLocation != undefined) {
            for (let m in tasks[l].remainingLocation.locations) {
                if (tasks[l].remainingLocation.locations[m].ID == locationID) {
                    task = tasks[l];
                    break;
                }
            }
        }
        if (task != undefined) {
            break;
        }
    }
    return task;
};


export const fillResults = (results, rating, campaign, oldRes) => {
    // populate results
    var res = [];
    for (let l in results) {
        var result = new Results();
        result.answerNumber = Number(l);
        result.answer = (results[l] === 'true');
        result.rating = rating;
        result.campaign = campaign;
        res.push(result);
    }
    if (oldRes != undefined || oldRes != null){
        for (let l in oldRes){
            res.push(oldRes[l]);
        }
    }
    return res;
};

export const fillCampaign = (results, campaign) => {
    results.forEach(res => {
        campaign.results.push(res);
    });
    return campaign;
};

export const removeLocation = (locations, locationID) => {
    for (let l in locations) {
        if (locationID == locations[l].ID) {
            locations.splice(Number(l), 1);
        }
    }

    return locations;
};

export const sendToMap = (task, campaignID) => {
    var route = [];
    var rlocations = [];
    if (task.remainingLocation !== null) {
        // order the locations for route
        var rte = 0;
        for (let m in task.remainingLocation.locations){
            if (task.remainingLocation.locations[m].route == rte){
                rlocations.push(task.remainingLocation.locations[m]);
                rte++;
            }
        }
        route = convertGeocodes(rlocations);
    }

    var completed = [];
    var clocations;
    if (task.completedLocation !== null) {
        clocations = task.completedLocation.locations;
        completed = convertGeocodes(clocations);
    }

    io.on('connection', function (socket) {
        socket.emit('route', {
            route: route,
            campaignID: campaignID,
            locations: rlocations,
            completed: completed,
            cLocations: clocations,
            taskID: task.ID
        });
    });
    return task;
};

function convertGeocodes(locations) {
    var codes = []
    for (let l in locations) {
        codes.push({
            lat: locations[l].lat,
            lng: locations[l].long
        });
    }
    return codes;
};


/**
 * Returns an array of tasks of the same assignment ID
 * @param id 
 * @param tasks 
 */
function getTasksOfId(id, tasks) {
    let assignment = [];
    tasks.forEach(task => {
        if (task._assignment._ID === id) {
            assignment.push(task)
        }
    });

    return assignment;
}

/**
 * Returns an array where each element is another
 * array that represents 1 assignment. Each assignment
 * element contains tasks that belong to it.
 * @param tasks 
 */
export const organizeByAssignment = (tasks) => {
    let ids = [];
    let single_assignment =[];
    let assignments = [];
    
    // Grab all the assignment Ids
    tasks.forEach(task => {
        ids.push(task._assignment._ID)
    });
    // Remove duplicates
    ids = ids.filter(onlyUnique)
    
    // With the ids organize tasks by Assignment id
    ids.forEach(id => {
        single_assignment = getTasksOfId(id, tasks);
        assignments.push({
            id,
            assignment: single_assignment
        })
    });

    return assignments;
}

/**
 * Used alongside filter to return an array
 * with only unique elements
 * @param value 
 * @param index 
 * @param self 
 */
function onlyUnique(value, index, self) { 
    return self.indexOf(value) === index;
}