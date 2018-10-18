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

var passwordValidator = require('password-validator');
const { createLogger, format, transports } = require('winston');
const router: Router = Router();

const path = require('path');
const env = process.env.NODE_ENV || 'development';
const logDir = 'log';


// Create the log directory if it does not exist
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

const filename = path.join(logDir, 'admin.log');

const logger = createLogger({
  // change level if in dev environment versus production
  level: env === 'development' ? 'debug' : 'info',
  format: format.combine(
    format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss'
    }),
    format.printf(info => `${info.timestamp} ${info.level}: ${info.message}`)
  ),
  transports: [
    new transports.Console({
      level: 'info',
      format: format.combine(
        format.colorize(),
        format.printf(
          info => `${info.timestamp} ${info.level}: ${info.message}`
        )
      )
    }),
    new transports.File({ filename })
  ]
});

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
        // res.redirect('/login');
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
    logger.info(`Changed Globals avgspeed=${avgSpeed} and taskLimit=${taskLimit}`);

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

router.post('/', isAuthenticated,[
    // Validation
    check('username').isLength({min : 5, max: 20}),
    check('password').isLength({min : 5, max: 50})
]
, async(req: Request, res: Response) => {

    /**
     * Ensure data from user is valid.
     */
    // const validPassword = !passwordSchema.validate(req.body.password);
    const validationErrors = await validationResult(req);
    if(validationErrors.isEmpty()) {
        console.log(validationErrors)
        logger.info(`ERROR: Invalid Username or Password during registration`);
        return res.status(422).send('Username or Password is of an invalid length. Needs to be between 5-20 characters');
    }

    let newUser: User;
    let roledUser: CampaignManager | Canvasser | SystemAdmin;
    

    /**
     * Create User from data in request from client.
     */
    req.body.user.password = await authSystem.hashPassword(req.body.user.password);
    console.log('The hash is:',req.body.user.password);
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
        .then(user => console.log('Saved:',user))
        .catch(e => console.log(e));
    await entityManager.save(roledUser)
        .then(user => console.log('Saved:',user))
        .catch(e => console.log(e));
    logger.info(`/user/new ADD USER - Created ${roledUser}`);
    res.status(200).redirect('/user/new'); 
});

// For security purposes we can limit the length of username to maybe 5-9? characters.
// The front end could do one check and then here we also check if its a valid user name
router.get('/:username', isAuthenticated, async(req: Request, res: Response) => {
    
    const userRepository = getRepository(User);
    const username = req.params.username;
    
    const user = await userRepository.find({where: {"_username": username}})
        .catch(e => console.log(e));
    
    if(user[0] === undefined) {
        console.log('not found')
        logger.info(`/user/${username} VIEW AND EDIT - Could not find ${username}s profile`);
        res.status(404).render('view-user', {
            missing: username,
            username: "",
            name: "",
            role: "",
            id: 0
        });
    } else {
        logger.info(`/user/${username} VIEW AND EDIT - Accessd ${username}s profile`);
        res.status(200).render('view-user', {
            
            username,
            name: user[0]._name,
            role: user[0]._permission,
            id: user[0]._employeeID
        });
    }

});

router.post('/:username', isAuthenticated, async(req: Request, res: Response) => {
    let originalUsername = req.params.username;

    console.log('The originalname is: ',originalUsername)
    const userRepository = getRepository(User);
    const unchangedUser = await userRepository.find({where: {"_username": req.params.username}})
        .catch(e => console.log(e));

    let user = req.body.user;
    user.password = "";         // TODO: Find a legit fix to how we create a new roled user for update
    let name = user.name;
    let username = user.username;
    let role = user.role;
    
    /**
     * Update the user on the database
     */
    await userRepository.query(
        `Update supercampaign.user 
        SET username = '${username}', fullname = '${name}', permission = '${role}'
        WHERE username = '${originalUsername}';`
    ).catch(e => console.log(e));

   
    /**
     * If role has changed, erase from orignal 
     * role table and add to new
     */
    let id = unchangedUser[0]._employeeID;
    let originalRole = unchangedUser[0]._permission;
    if(role !== originalRole) {         
        // Delete this user from old role table 
        
        userManager.deleteUserFromRole(unchangedUser[0]._permission, id);

        // Add this user to their new role table
        let updatedUser = userManager.createBaseUser(user);
        updatedUser.employeeID = id;
        
        let updatedRoledUser = userManager.createRoledUser(role, updatedUser);
        
        const entityManager = getManager();
        await entityManager
            .save(updatedRoledUser)
            .then(user2 =>{} )
            .catch(e => console.log(e));
    }
    logger.info(`EDIT USER /user/${originalUsername} Edited ${originalUsername}`);
    res.send('hello');
});

router.delete('/:username', isAuthenticated, async(req: Request, res: Response) => {
    
    
    // EmployeeID is required to remove user from roled table
    const userRepository = getRepository(User);    
    const user = await userRepository.find({where: {"_username": req.params.username}})
        .catch(e => console.log(e));
    /**
     * Delete User from Specific Role Table
     * This record must be deleted first due
     * to foreign key constraing. THEN
     * Delete User from User table
     */
    // await userRepository.query(
    //     `DELETE FROM supercampaign.system_admin             
    //     WHERE ID_employeeID = '${user[0]._employeeID}';`
    // )
    // .catch(e => console.log(e));
    
    await userRepository
        .createQueryBuilder()
        .delete()
        .where("_employeeID = :ID", {ID: user[0].employeeID})
        .execute();
    logger.info(`EDIT USER - Deleted ${user[0]._name}`);
    // await userRepository.query(
    //     `DELETE FROM supercampaign.user
    //     WHERE employeeID = '${user[0]._employeeID}';`
    // )
    // .catch(e => console.log(e));
    

    /**
     * Sanity Check
     * If page loads with user, user was not deleted from the DB
     * else it was successfull.
     */
    res.status(200).redirect('/user/' + req.params.username);
});

export {router as adminRouter}