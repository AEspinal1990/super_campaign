import { Request, Response, Router }    from 'express';
import { createConnection }     from "typeorm";
import * as fs from 'fs';

import { CampaignManager }      from '../backend/entity/CampaignManager';
import { Canvasser }      from '../backend/entity/Canvasser'; 
import { SystemAdmin }      from '../backend/entity/SystemAdmin'; 
import { User } from '../backend/entity/User';

import * as createUserSytem from '../util/createUser';

const router: Router = Router();

router
    .get('/user/new', async(req: Request, res: Response) => {
        res.render('create-user');
    })
    
    .post('/user', async(req: Request, res: Response) => {
        let newUser:User;
        let roledUser: CampaignManager | Canvasser | SystemAdmin;

        /**
         * Create User from data passed in.
         */
        newUser = createUserSytem.createBaseUser(req.body.user);
        
        /**
         * Create specialized user based off role.
         */    
        roledUser = createUserSytem.createRoledUser(newUser.permission, newUser);

        await createConnection()
            .then(async connection => {
                await connection.manager.save(newUser);
                await connection.manager.save(roledUser);
            })
            .catch(e => {
                console.log(e);
                res.send('Error');
            });
        
        res.status(200).redirect('/adduser');
    })

    .get('/globals', async(req: Request, res: Response) => {
        let raw_gp = fs.readFileSync('src/globals.json');
        // @ts-ignore
        let global_params = JSON.parse(raw_gp);
        let taskLimit = global_params.taskTimeLimit;
        let avgSpeed = global_params.averageSpeed;

        res.render('edit-globals',{avgSpeed, taskLimit})
    })
    .post('/globals', async(req: Request, res: Response) => {
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
    })

export {router as adminRouter}