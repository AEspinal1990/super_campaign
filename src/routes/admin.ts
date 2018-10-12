import { Request, Response }    from 'express';
import { createConnection }     from "typeorm";
import { CampaignManager }      from '../backend/entity/CampaignManager';
import { Canvasser }      from '../backend/entity/Canvasser'; 
import { SystemAdmin }      from '../backend/entity/SystemAdmin'; 
import { User } from '../backend/entity/User';

// This is just a test. Home should be what page? Under
export const adminHome = (req: Request, res: Response) => {
    res.send('Hello!');
};

export const createUserPage = (req: Request, res: Response) => {
    res.render('create-user');
};

export const createUser = (req: Request, res: Response) => {
    const newUser:User = new User();
    let roledUser: CampaignManager | Canvasser | SystemAdmin;

    newUser.name = req.body.user.name;
    newUser.username = req.body.user.username;
    newUser.permission = parseInt(req.body.user.role);

    let role: Number = newUser.permission;
    if(role === 1) {
        roledUser = new CampaignManager();
    }
    else if(role === 2) {
        roledUser = new Canvasser();
    } else {
        roledUser = new SystemAdmin();
    }

    roledUser.ID = newUser;
    console.log(newUser);
    console.log(roledUser);
    
    res.status(200).send('Received');
};
