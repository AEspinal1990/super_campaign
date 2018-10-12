import { Request, Response }    from 'express';
import { createConnection }     from "typeorm";
import { CampaignManager }      from '../backend/entity/CampaignManager'  

// This is just a test. Home should be what page? Under
export const home = (req: Request, res: Response) => {
    res.send('Hello!');
};

export const createUserPage = (req: Request, res: Response) => {
    res.render('create-user');
};

export const createUser = (req: Request, res: Response) => {
    console.log(req.body);
    res.status(200).send('Received');
};

// export const addUser = async (req: Request, res: Response) => {
//     const user = new CampaignManager(3,[1,2,3]);
//     console.log('test')
//     createConnection()
//         .then(async connection => {
//             await connection.manager.save(user).then(() =>{
//                 console.log('saved campaign manager?');
//             })
//             res.status(200).send(user);
//         })
//         .catch(e => {
//             console.log('ERROR:',e);
//             res.status(400).send(user);
//         });
//  };