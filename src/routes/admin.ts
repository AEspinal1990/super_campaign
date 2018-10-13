import { Request, Response, Router }    from 'express';
import { createConnection }     from "typeorm";
import { CampaignManager }      from '../backend/entity/CampaignManager';
import { Canvasser }      from '../backend/entity/Canvasser'; 
import { SystemAdmin }      from '../backend/entity/SystemAdmin'; 
import { User } from '../backend/entity/User';

import * as createUserSytem from '../util/createUser';

const router: Router = Router();

router
    .get('/new', async(req: Request, res: Response) =>{
        res.render('create-user');
    })
    
    .post('/', async(req: Request, res: Response)=>{
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

export {router as adminRouter}