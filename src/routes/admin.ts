import { Request, Response } from 'express';
import { Repository } from 'typeorm';
import { CampaignManager } from '../backend/entity/CampaignManager';
import {createConnection} from "typeorm";

// This is just a test. Home should be what page? Under
export const home = (req: Request, res: Response) => {
    res.send('Hello!');
};

export const addUser = async (req: Request, res: Response) => {
    const user = new CampaignManager(3,[1,2,3]);

    await createConnection()
        .then(async connection => {
            await connection.manager.save(user).then(() =>{
                console.log('saved campaign manager?');
            })
            res.status(200).send(user);
        })
        .catch(e => {
            console.log('ERROR:',e);
            res.status(400).send(user);
        });
};