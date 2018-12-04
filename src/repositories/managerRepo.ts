import { Canvasser } from '../backend/entity/Canvasser';
import { getManager } from 'typeorm';
import { Task } from '../backend/entity/Task';
import { RemainingLocation } from '../backend/entity/RemainingLocation';
import { Campaign } from '../backend/entity/Campaign';


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
};


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
};


export const getTask = async (taskId) => {
    return await getManager()
        .createQueryBuilder(Task, "task")
        .where("_ID = ID", { ID: taskId })
        .getMany();
};


export const getRemainingLocations = async taskID => {
    return await getManager()
        .createQueryBuilder(RemainingLocation, "remainingLocation")
        .leftJoinAndSelect("remainingLocation._locations", "locations")
        .where("remainingLocation._ID = :ID", { ID: taskID })
        .getMany();
};


export const getCanvasserCampaigns = async employeeID => {
    return await getManager()
        .createQueryBuilder(Canvasser, "canvasser")
        .leftJoinAndSelect("canvasser._ID", "user")
        .leftJoinAndSelect("canvasser._campaigns", "campaigns")
        .leftJoinAndSelect("campaigns._assignment", "assignment")
        .where("user._employeeID = :id", { id: employeeID })
        .getOne();
};


export const getTaskAssignment = async campaignID => {
    return await await getManager()
        .createQueryBuilder(Task, "task")
        .leftJoinAndSelect("task._assignment", "assignment")
        .where("task._campaignID = :id", { id: campaignID })
        .getOne()
        .then(res => {
            return res;
        });
};


export const getAssignmentTasks = async assignmentID => {
    return await getManager()
        .createQueryBuilder(Task, "task")
        .leftJoinAndSelect("task._assignment", "assignment")
        .leftJoinAndSelect("task._remainingLocation", "RL")
        .leftJoinAndSelect("RL._locations", "RLocation")
        .where("assignment._ID = :id", { id: assignmentID })
        .getMany()
        .then(res => {
            return res;
        });
};


export const removeRL = async (RLID, locationID) => {
    await getManager()
        .createQueryBuilder()
        .relation(RemainingLocation, "_locations")
        .of(RLID)
        .remove(locationID);
};


export const removeRLofTask = async taskID => {
    await getManager()
        .createQueryBuilder()
        .relation(Task, "_remainingLocation")
        .of(taskID)
        .set(null);
}


export const deleteTask = async taskID => {
    await getManager()
        .createQueryBuilder()
        .delete()
        .from(Task)
        .where("_ID = :id", { id: taskID })
        .execute();
};


export const getCampaignBasic = async campaignID => {
    return await getManager().findOne(Campaign,
        { where: { "_ID": campaignID } });
}