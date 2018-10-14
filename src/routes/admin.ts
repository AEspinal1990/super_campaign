import { Request, Response, Router }    from 'express';
import { createConnection, getManager, getConnection }     from "typeorm";
import * as fs from 'fs';

import { CampaignManager }      from '../backend/entity/CampaignManager';
import { Canvasser }      from '../backend/entity/Canvasser'; 
import { SystemAdmin }      from '../backend/entity/SystemAdmin'; 
import { User } from '../backend/entity/User';

import * as createUserSytem from '../util/createUser';

const router: Router = Router();

/**
 * Create/Edit/Delete User 
 */
router.get('/new', async(req: Request, res: Response) => {
    res.render('create-user');
});    

router.post('/', async(req: Request, res: Response) => {
    let newUser: User;
    let roledUser: CampaignManager | Canvasser | SystemAdmin;

    /**
     * Create User from data in request from client.
     */
    newUser = createUserSytem.createBaseUser(req.body.user);
    
    /**
     * Create specialized user based off permission of user.
     */    
    roledUser = createUserSytem.createRoledUser(newUser.permission, newUser);

    /**
     * Save the new user into user table and table for 
     * their specific role.
     */
    await createConnection()
        .then(async connection => {
            await connection.manager.save(newUser);
            await connection.manager.save(roledUser);
        })
        .catch(e => {
            console.log(e);
            res.send('Error');
        });
    
    res.status(200).redirect('/user/new'); //remember to change
});

router.get('/:username',  async(req: Request, res: Response) => {
    let username = req.params.username;
    let user;
    const connection = getConnection();
    // await createConnection().then(async () => {
    //     user = await getManager()
    //         .createQueryBuilder(User, 'user')
    //         .where(`username = :username`, {username})
    //         .getOne()
    //         .then(found => {
    //             if(found === undefined){
    //                 console.log('Could not find that user');
    //             } else {
                    
    //                 res.status(200).render('view-user', {
    //                     username,
    //                     name: found.name,
    //                     role: found.permission,
    //                     id: found._employeeID                         
    //                 });
                    
    //             }                
    //         });            
    // }).catch(e => console.log(e))

    res.status(200).send('Nothing probably broke');
});

router.post('/:username', async(req: Request, res: Response) => {
    // Parse the body
    // Create user with data

    //  If role has changed
    //      Remove from old role table
    //      Insert into new role table

});

router.delete('/:username', async(req: Request, res: Response) => {
    let user:string = req.params.username;
    await createConnection()
        .then( async () => {
            await getManager()
            .createQueryBuilder()
            .delete()
            .from(User)
            .where("username = :username", {username: user})
            .execute();           
        })
        .catch(e =>{
            console.log(e);
            res.send('Error');
        });
    
    res.status(200).redirect('/user');
});


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



export {router as adminRouter}