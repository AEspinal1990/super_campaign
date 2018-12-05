import { getManager, getRepository } from 'typeorm';
import { TalkPoint } from '../backend/entity/TalkPoint';
import { Task } from '../backend/entity/Task';
import { Results } from '../backend/entity/Results';
import { Canvasser } from '../backend/entity/Canvasser';
import { Availability } from '../backend/entity/Availability';
import { Questionaire } from '../backend/entity/Questionaire';
import { Locations } from '../backend/entity/Locations';
import { Campaign } from '../backend/entity/Campaign';


export const getTaskByID = async taskID => {
    return await getManager()
        .createQueryBuilder(Task, "task")
        .leftJoinAndSelect("task._remainingLocation", "RL")
        .leftJoinAndSelect("RL._locations", "RLocations")
        .leftJoinAndSelect("task._completedLocation", "CL")
        .leftJoinAndSelect("CL._locations", "CLocations")
        .where("task._ID = :id", { id: taskID })
        .getOne()
        .then(res => {
            return res;
        })
        .catch(e => console.log(e));
};


export const getCanvassersTask = async canvasserName => {
    return await getManager()
        .createQueryBuilder(Task, "task")
        .leftJoinAndSelect("task._remainingLocation", "RL")
        .leftJoinAndSelect("RL._locations", "locations")
        .leftJoinAndSelect("task._completedLocation", "CL")
        .leftJoinAndSelect("CL._locations", "CLocations")
        .leftJoinAndSelect("task._assignment", "assignment")
        .where("task._canvasser = :canvasserName", { canvasserName })
        .getMany()
        .then(res => {
            return res;
        })
        .catch(e => console.log(e));
};


export const getCanvasserTaskCampaign = async employeeID => {
    return await getManager()
        .createQueryBuilder(Canvasser, "canvasser")
        .leftJoinAndSelect("canvasser._task", "task")
        .leftJoinAndSelect("canvasser._campaigns", "campaign")
        .leftJoinAndSelect("canvasser._ID", "user")
        .where("user._employeeID = :ID", { ID: employeeID })
        .getOne();
};


export const getCanvasserTaskRL = async campaignID => {
    console.log("inside getCanvasserTakRL: ", campaignID)
    return await getManager()
        .createQueryBuilder(Canvasser, "canvasser")
        .leftJoinAndSelect("canvasser._campaigns", "campaign")
        .leftJoinAndSelect("canvasser._task", "task")
        .leftJoinAndSelect("task._remainingLocation", "rmL")
        .leftJoinAndSelect("rmL._locations", "fmLs")
        .where("campaign._ID = :ID", { ID: campaignID })
        .getOne()
        .then(res => {
            console.log("after get")
            return res;
        });
};


export const getCanvasserCampaignsTasks = async employeeID => {
    return await getManager()
    .createQueryBuilder(Canvasser, "canvasser")
    .leftJoinAndSelect("canvasser._ID", "user")
    .leftJoinAndSelect("canvasser._campaigns", "campaigns")
    .leftJoinAndSelect("canvasser._task", "task")
    .where("user._employeeID = :id", { employeeID })
    .getOne();
};


export const getTasksByCampaign = async campaignID => {
    return await getManager()
        .createQueryBuilder(Task, "task")
        .leftJoinAndSelect("task._remainingLocation", "RL")
        .leftJoinAndSelect("RL._locations", "locations")
        .leftJoinAndSelect("task._completedLocation", "CL")
        .leftJoinAndSelect("CL._locations", "CLocations")
        .where("task._campaignID = :cid", { cid: campaignID })
        .getMany()
        .then(res => {
            return res;
        })
        .catch(e => console.log(e));
};


export const getResults = async campaignID => {
    return await getManager()
        .createQueryBuilder(Results, "results")
        .leftJoinAndSelect("results._completedLocation", "CL")
        .leftJoinAndSelect("results._campaign", "campaign")
        .where("campaign._ID = :id", { id: campaignID })
        .getMany();
};


export const getTalk = async campaignID => {
    return await getManager().find(TalkPoint, { where: { "_campaign": campaignID } });
};


export const getCanvasserDates = async canvasserID => {
    return await getManager()
        .createQueryBuilder(Canvasser, "canvasser")
        .leftJoinAndSelect("canvasser._ID", "user")
        .leftJoinAndSelect("canvasser._campaigns", "campaign")
        .leftJoinAndSelect("canvasser._availableDates", "avaDate")
        .leftJoinAndSelect("canvasser._assignedDates", "assDate")
        .where("canvasser._ID = :ID", { ID: canvasserID })
        .getOne();
};


export const deleteAvailDate = async availID => {
    await getRepository(Availability)
        .createQueryBuilder()
        .delete()
        .where("_ID = :ID", { ID: availID })
        .execute();
};


export const getQuestionaire = async campaignID => {
    return await getManager().find(Questionaire, { where: { "_campaign": campaignID } });
};


export const getLocation = async locationID => {
    return await getManager().findOne(Locations, { where: { "_ID": locationID } });
};


export const getCampaignBasic = async campaignID => {
    return await getManager().findOne(Campaign, { where: { "_ID": campaignID } });
};


export const getResultsBasic = async campaignID => {
    return await getManager().find(Results, { where: { "_campaign": campaignID } });
};


export const saveResults = async (employeeID, results) => {
    await getManager()
        .createQueryBuilder()
        .relation(Canvasser, "_results")
        .of(employeeID)
        .add(results)
        .then(res => console.log("after results save for canvassers"))
        .catch(e => console.log(e));
}