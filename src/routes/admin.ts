import { Request, Response, Router }    from 'express';
import { getManager, getRepository }    from "typeorm";
import { check, validationResult }      from 'express-validator/check';
import * as fs                          from 'fs';

import { CampaignManager }  from '../backend/entity/CampaignManager';
import { Canvasser }        from '../backend/entity/Canvasser'; 
import { SystemAdmin }      from '../backend/entity/SystemAdmin'; 
import { User }             from '../backend/entity/User';

import * as userManager from '../util/userManagementSystem';
import * as authSystem  from '../config/auth';
import {adminLogger}    from '../util/logger';


var passwordValidator = require('password-validator');
const router: Router = Router();

const passwordSchema:any = new passwordValidator();
passwordSchema
    .is().min(8)                                    // Minimum length 8
    .is().max(100)                                  // Maximum length 100
    .has().uppercase()                              // Must have uppercase letters
    .has().lowercase()                              // Must have lowercase letters
    .has().digits()                                 // Must have digits
    .has().not().spaces()                           // Should not have spaces
    .is().not().oneOf(['Passw0rd', 'Password123',   // Blacklist these values
    'Password','password','Qwert1!']);     


const isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next()
    } else {
        res.redirect('/');
    }
}


/**
 * View and Edit Global Parameters
 */
router.get('/globals', isAuthenticated, async(req: Request, res: Response) => {
    let raw_gp = fs.readFileSync('src/globals.json');
    // @ts-ignore
    let global_params = JSON.parse(raw_gp);
    let taskLimit = global_params.taskTimeLimit;
    let avgSpeed = global_params.averageSpeed;

    res.render('edit-globals',{avgSpeed, taskLimit})
});

router.post('/globals', isAuthenticated, async(req: Request, res: Response) => {
    let taskLimit = req.body.global.taskLimit;
    let avgSpeed = req.body.global.avgSpeed;
    adminLogger.info(`${req.user[0]._username} changed globals. Avgspeed is now ${avgSpeed} and taskLimit is now ${taskLimit}`);

    let global_params = {
        taskTimeLimit: taskLimit,
        averageSpeed: avgSpeed
    };

    let data = JSON.stringify(global_params,null,2);
    // Reason redirect does not work is that right after the file
    // is saved the server goes down and restarts. While it's
    // down a request is made to /globals which cannot be answered
    // which causes refresh to fail.
    await fs.writeFileSync('src/globals.json', data);

    res.status(200).redirect(req.get('referer'))
});

/**
 * Create/Edit/Delete User 
 */
router.get('/new', async(req: Request, res: Response) => {
    res.status(200).render('create-user');
});    

router.post('/', [
    // Validation
    check('username').isLength({min : 5, max: 20}),
    check('password').isLength({min : 5, max: 50})
]
, async(req: Request, res: Response) => {

    /** TODO: Finish validation
     * Ensure data from user is valid.
     */
    // const validPassword = !passwordSchema.validate(req.body.password);
    const validationErrors = await validationResult(req);
    if(validationErrors.isEmpty()) {
        console.log(validationErrors)
        adminLogger.error(`Invalid Username or Password during registration`);
        return res.status(422).send('Username or Password is of an invalid length. Needs to be between 5-20 characters');
    }

    let newUser: User;
    let roledUser: CampaignManager | Canvasser | SystemAdmin;    

    /**
     * Create User from data in request from client.
     */
    req.body.user.password = await authSystem.hashPassword(req.body.user.password);
    newUser = userManager.createBaseUser(req.body.user);
    
    /**
     * Create specialized user based off permission of user.
     */    
    roledUser = userManager.createRoledUser(newUser.permission, newUser);

    /**
     * Save the new user into user table and table for 
     * their specific role.
     */
    const entityManager = getManager();
    await entityManager.save(newUser)
        .then(async (newUser) =>{
            await entityManager.save(roledUser);
            return newUser;
        })
        .then((newUser) => adminLogger.info(`/user/new - Created user: ${newUser.username} with id: ${newUser.employeeID}. Has permission ${newUser.permission}.`))
        .catch(e =>{
            adminLogger.error(`/user/new Error occured while creating ${newUser.username}, ${e}`);
        });

    res.status(200).redirect('/user/new'); 
});


router.get('/:username', isAuthenticated, async(req: Request, res: Response) => {
    
    const userRepository = getRepository(User);
    const username = req.params.username;
    
    const user = await userRepository.find({where: {"_username": username}})
        .catch(e => adminLogger.error(`Could not find user in ${username} in database, ${e}`));
    
    if(user[0] === undefined) {
        adminLogger.info(`/user/${username} - Could not find ${username}s profile`);
        res.status(404).render('view-user', {
            missing: username,
            username: "",
            name: "",
            role: "",
            id: 0
        });
    } else {
        adminLogger.info(`/user/${username} - Accessed ${username}s profile`);
        res.status(200).render('view-user', {            
            username,
            name: user[0]._name,
            role: user[0]._permission,
            id: user[0]._employeeID,
        });
    }
});

router.post('/:username', isAuthenticated, async(req: Request, res: Response) => {
    let originalUsername = req.params.username;

    // TODO: Error handling needed for when user not found
    const userRepository = getRepository(User);
    const unchangedUser = await userRepository.find({where: {"_username": req.params.username}})
        .catch(e => adminLogger.error(`Could not find user in ${username} in database, ${e}`));

    let user = req.body.user;
    let password = unchangedUser[0]._password;
    let name = user.name;
    let username = user.username;
    let role = user.role;
    console.log('PASS:', password);
    /**
     * Update the user on the database
     */
    await userRepository.query(
        `Update supercampaign.user 
        SET username = '${username}', fullname = '${name}', permission = '${role}', passwd = '${password}' 
        WHERE username = '${originalUsername}';`
    ).catch(e => adminLogger.error(`Error occured while updating ${username} in database, ${e}`));
    
    /**
     * If role has changed, erase from orignal 
     * role table and add to new
     */
    let id = unchangedUser[0]._employeeID;
    let originalRole = unchangedUser[0]._permission;
    if(role !== originalRole) {         

        // Delete this user from old role table         
        userManager.deleteUserFromRole(unchangedUser[0]._permission, id);

        // Create new instance of roled user
        let updatedUser = userManager.createBaseUser(user);
        updatedUser.employeeID = id;        
        let updatedRoledUser = userManager.createRoledUser(role, updatedUser);
        
        // Add this user to their new role table
        const entityManager = getManager();
        await entityManager
            .save(updatedRoledUser)
            .then(() => adminLogger.info(`/user/${originalUsername} Edited ${originalUsername}`))
            .catch(e => adminLogger.error(`Error occured while updating role tables of${username} in database, ${e}`));
    }
    
    // TODO: Find a better place to route to
    res.send('hello');
});

router.delete('/:username', isAuthenticated, async(req: Request, res: Response) => {    
    
    // EmployeeID is required to remove user from roled table
    const userRepository = getRepository(User);    
    const user = await userRepository.find({where: {"_username": req.params.username}})
        .catch(e => adminLogger.error(`Could not find ${req.params.username} in database, ${e}`));

    /**
     * Delete User from Specific Role Table
     * This record must be deleted first due
     * to foreign key constraing. THEN
     * Delete User from User table
     */
    await userRepository
        .createQueryBuilder()
        .delete()
        .where("_employeeID = :ID", {ID: user[0].employeeID})
        .execute()
        .then(() => adminLogger.info(`/${req.params.username} Deleted ${user[0]._name}`));


    // TODO: Find a better palce to route to after a user has been deleted
    /**
     * Sanity Check
     * If page loads with user, user was not deleted from the DB
     * else it was successfull.
     */
    res.status(200).redirect('/user/' + req.params.username);
});

export {router as adminRouter}