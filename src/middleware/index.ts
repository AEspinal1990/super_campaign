import { getManager }           from 'typeorm';
import { CampaignManager }      from '../backend/entity/CampaignManager';
import { Request, Response, NextFunction }    from 'express';


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

middlewareObj.manages = (req: Request, res: Response, next: NextFunction) => {
    console.log(req.params);
    if (req.isAuthenticated() && req.user[0]._permission === 1) {
        
        return next()
    } else {
        res.redirect('/');
    }  
}


/**
 * Given a campaignID return true if this manager 
 * manages this campaign.
 * @param campaignId 
 */
function isManagerOf(managerID, campaignId) {
    // NEED QUERY
}

/**
 * Given canvasserID check if they can edit the
 * requested calendar.
 * @param canvasserID 
 */
function isCanvasser(canvasserID){
    // NEED QUERY

}

module.exports = middlewareObj;