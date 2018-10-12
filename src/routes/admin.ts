import { Request, Response }    from 'express';
import { createConnection }     from "typeorm";
import { CampaignManager }      from '../backend/entity/CampaignManager'  
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
    newUser.name = req.body.user.name;
    newUser.username = req.body.user.username;
    newUser.permission = parseInt(req.body.user.role);
    console.log(newUser);
    res.status(200).send('Received');
};
