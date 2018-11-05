import { getManager }           from 'typeorm';
import { Request, Response, NextFunction }    from 'express';
import { Campaign } from '../backend/entity/Campaign';


const middlewareObj = <any>{};

middlewareObj.isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
    if (req.isAuthenticated()) {
        return next()
    } else {
        res.redirect('/');
    }
}

middlewareObj.isAdmin = (req: Request, res: Response, next: NextFunction) => {
    if (req.isAuthenticated() && req.user[0]._permission === 3) {
        return next()
    } else {
        res.redirect('/');
    }    
}

middlewareObj.isManager = (req: Request, res: Response, next: NextFunction) => {
    if (req.isAuthenticated() && req.user[0]._permission === 1) {
        return next()
    } else {
        res.redirect('/');
    }    
}

middlewareObj.manages = async (req: Request, res: Response, next: NextFunction) => {
    console.log('id', req.params.id)
    let thing = await isManagerOf(req.user[0]._employeeID, req.params.id);
    if (req.isAuthenticated() && thing) {
        console.log("true1");
        return next()
    } else {
        console.log("false1");
        res.redirect('/');
    }  
}

middlewareObj.isCanvasser = async (req: Request, res: Response, next: NextFunction) => {
    if (req.isAuthenticated() && (req.user[0]._employeeID === req.params.id)){
        return next()
    }
}


/**
 * Given a campaignID return true if this manager 
 * manages this campaign.
 * @param campaignId 
 */
async function isManagerOf(managerID, campaignId) {
    var campaign = await getManager().findOne(Campaign, {where: {"_ID": campaignId}});
    console.log(campaign)
    for (let i in campaign.managers){
        if (campaign.managers[i].ID.employeeID === managerID){
            console.log("true2")
            return true;
        }
    }
    console.log("false2");
    return false;
}

/**
 * Given canvasserID check if they can edit the
 * requested calendar.
 * @param canvasserID 
 */
async function isCanvass(canvasserID){
    // query not needed:
        // check the requesting canvasserID and the stated canvasserID
}

module.exports = middlewareObj;