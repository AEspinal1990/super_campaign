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
        .where("task._ID = :id", { id: taskID })
        .getOne();
    return task;
};

export const getTasksByCampaign = async (campaignID) => {
    var task = await getManager()
        .createQueryBuilder(Task, "task")
        .leftJoinAndSelect("task._remainingLocation", "RL")
        .leftJoinAndSelect("RL._locations", "locations")
        .leftJoinAndSelect("task._completedLocation", "CL")
        .leftJoinAndSelect("CL._locations", "CLocations")
        .where("task._campaignID = :cid", { cid: campaignID })
        .getMany();
    return task;
};

export const findTask = (tasks, locationID) => {
    var task;

    for (let l in tasks){
        for (let m in tasks[l].remainingLocation.locations){
            if (tasks[l].remainingLocation.locations[m].ID == locationID){
                task = tasks[l];
                break;
            }
        }
        if (task != undefined){
            break;
        }
    }
    return task;
};

export const getTalk = async (campaignID) => {
    var talk = await getManager().find(TalkPoint, { where: { "_campaign": campaignID } });
    return talk;
};

export const fillResults = (results, rating, campaign) => {
    // populate results
    var res = [];
    for (let l in results) {
        var result = new Results();
        result.answerNumber = Number(l);
        result.answer = results[l];
        result.rating = rating;
        result.campaign = campaign;
        res.push(result);
    }

    return res;
};

export const removeLocation = (locations, locationID) => {
    for (let l in locations){
        if (locationID == locations[l]){
            locations[l].splice(Number(l), 1);
        }
    }

    console.log(locations);
    return locations;
};

export const sendToMap = async (taskID, campaignID) => {
    var task = await getManager()
        .createQueryBuilder(Task, "task")
        .leftJoinAndSelect("task._remainingLocation", "RL")
        .leftJoinAndSelect("RL._locations", "RLocations")
        .leftJoinAndSelect("task._completedLocation", "CL")
        .leftJoinAndSelect("CL._locations", "CLocations")
        .where("task._ID = :id", { id: taskID })
        .getOne();
    console.log(task.remainingLocation)
    
    var route = [];
    var rlocations;
    if (task.remainingLocation !== undefined) {
        if (task.remainingLocation.locations !== undefined){
            rlocations = task.remainingLocation.locations;
            route = convertGeocodes(rlocations);
        }
    }

    var completed = [];
    var clocations;
    if (task.completedLocation !== undefined) {
        if (task.completedLocation.locations !== undefined){
            clocations = task.completedLocation.locations;
            completed = convertGeocodes(clocations);
        }
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

function convertGeocodes(locations){
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