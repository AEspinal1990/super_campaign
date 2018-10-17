import { Request, Response, Router }    from 'express';
import { getManager, getRepository }     from "typeorm";
import * as fs from 'fs';

import { CampaignManager }      from '../backend/entity/CampaignManager';
import { Canvasser }      from '../backend/entity/Canvasser'; 
import { SystemAdmin }      from '../backend/entity/SystemAdmin'; 
import { User } from '../backend/entity/User';

import * as userManager from '../util/userManagementSystem';

const router: Router = Router();

/**
 * View and Edit Global Parameters
 */
router.get('/globals', async(req: Request, res: Response) => {
    let raw_gp = fs.readFileSync('src/globals.json');
    // @ts-ignore
    let global_params = JSON.parse(raw_gp);
    let taskLimit = global_params.taskTimeLimit;
    let avgSpeed = global_params.averageSpeed;

    res.render('edit-globals',{avgSpeed, taskLimit})
});

router.post('/globals', async(req: Request, res: Response) => {
    let taskLimit = req.body.global.taskLimit;
    let avgSpeed = req.body.global.avgSpeed;

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

router.post('/', async(req: Request, res: Response) => {
    let newUser: User;
    let roledUser: CampaignManager | Canvasser | SystemAdmin;

    /**
     * Create User from data in request from client.
     */
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

    res.status(200).redirect('/user/new'); 
});

router.get('/:username',  async(req: Request, res: Response) => {
    const userRepository = getRepository(User);
    const username = req.params.username;
    
    const user = await userRepository.find({where: {"_username": username}})
        .catch(e => console.log(e));

    if(user[0] === undefined) {
        console.log('not found')
        res.status(404).render('view-user', {
            missing: username,
            username: "",
            name: "",
            role: "",
            id: 0
        });
    } else {
        res.status(200).render('view-user', {
            username,
            name: user[0]._name,
            role: user[0]._permission,
            id: user[0]._employeeID
        });
    }

});

router.post('/:username', async(req: Request, res: Response) => {
    let originalUsername = req.params.username;
    const userRepository = getRepository(User);
    const unchangedUser = await userRepository.find({where: {"_username": req.params.username}})
        .catch(e => console.log(e));

    let user = req.body.user;
    user.password = "";         // TODO: Find a legit fix to how we create a new roled user for update
    let name = user.name;
    let username = user.username;
    let role = user.role;
    console.log('The role from the front end is: ', role);
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
        console.log('THe role number is: ', unchangedUser[0]._permission);
        userManager.deleteUserFromRole(unchangedUser[0]._permission, id);

        // Add this user to their new role table
        let updatedUser = userManager.createBaseUser(user);
        updatedUser.employeeID = id;
        console.log('ROle before creation', role)
        let updatedRoledUser = userManager.createRoledUser(role, updatedUser);
        console.log('The updated user before saving: ',updatedRoledUser);
        const entityManager = getManager();
        await entityManager
            .save(updatedRoledUser)
            .then(user2 =>{} )
            .catch(e => console.log(e));
    }

    res.send('hello');
});

router.delete('/:username', async(req: Request, res: Response) => {
    
    
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