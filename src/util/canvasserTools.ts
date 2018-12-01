import { getManager } from 'typeorm';
import { TalkPoint } from '../backend/entity/TalkPoint';
import { Task } from '../backend/entity/Task';
import { Results } from '../backend/entity/Results';
import { io } from '../server';

export const getTaskByID = async (taskID) => {
    var task = await getManager()
        .createQueryBuilder(Task, "task")
        .leftJoinAndSelect("task._remainingLocation", "RL")
        .leftJoinAndSelect("RL._locations", "RLocations")
        .leftJoinAndSelect("task._completedLocation", "CL")
        .leftJoinAndSelect("CL._locations", "CLocations")
        // .leftJoinAndSelect("CL._results", "results")
        .where("task._ID = :id", { id: taskID })
        .getOne()
        .then(res => {
            return res;
        })
        .catch(e => console.log(e));
    // task.completedLocation.results = await getResults(task);
    // console.log('The task', task)
    return task;
};

export const getCanvassersTask = async (canvasserName) => {
    var task = await getManager()
        .createQueryBuilder(Task, "task")
        .leftJoinAndSelect("task._remainingLocation", "RL")
        .leftJoinAndSelect("RL._locations", "locations")
        .leftJoinAndSelect("task._completedLocation", "CL")
        .leftJoinAndSelect("CL._locations", "CLocations")
        .leftJoinAndSelect("task._assignment", "assignment")
        // .leftJoinAndSelect("CL._results", "results")
        .where("task._canvasser = :canvasserName", { canvasserName })
        .getMany()
        .then(res => {
            return res;
        })
        .catch(e => console.log(e));
    return task;
}

export const getTasksByCampaign = async (campaignID) => {
    var task = await getManager()
        .createQueryBuilder(Task, "task")
        .leftJoinAndSelect("task._remainingLocation", "RL")
        .leftJoinAndSelect("RL._locations", "locations")
        .leftJoinAndSelect("task._completedLocation", "CL")
        .leftJoinAndSelect("CL._locations", "CLocations")
        // .leftJoinAndSelect("CL._results", "results")
        .where("task._campaignID = :cid", { cid: campaignID })
        .getMany()
        .then(res => {
            return res;
        })
        .catch(e => console.log(e));
    return task;
};

export const getResults = async (task, campaignID) => {
    var res = [];
    var results = await getManager()
        .createQueryBuilder(Results, "results")
        .leftJoinAndSelect("results._completedLocation", "CL")
        .leftJoinAndSelect("results._campaign", "campaign")
        .where("campaign._ID = :id", { id: campaignID })
        .getMany();

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

export const getTalk = async (campaignID) => {
    var talk = await getManager().find(TalkPoint, { where: { "_campaign": campaignID } });
    return talk;
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

    // console.log(locations);
    return locations;
};

export const sendToMap = (task, campaignID) => {
    console.log("SendToMap: ", task)
    var route = [];
    var rlocations = [];
    if (task.remainingLocation !== null) {
        // order the locations for route
        for (let m in task.remainingLocation.locations){
            if (task.remainingLocation.locations[m].route == Number(m)){
                rlocations.push(task.remainingLocation.locations[m]);
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

    console.log("RLocations: ", rlocations)
    console.log("CLocations: ", clocations)

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
        // console.log(task.remainingLocation.locations[l])
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