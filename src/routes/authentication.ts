import { Request, Response, Router } from 'express';
import { User } from "../backend/entity/User";
import { createConnection, getConnection, getManager } from "typeorm";

const router: Router = Router();

/**
 * GET and POST routes for Log In / Authentications
 */
router.get('/', (req: Request, res: Response) => {
        res.render('login');
    });

router.post('/', async(req: Request, res: Response) => {
    let credentials = req.body.user;
    console.log(credentials)
    
    await createConnection().then(async () => {
        const user = await getManager()
            .createQueryBuilder(User, 'user')
            .where(`username = :username`, {username: credentials.username})
            .getOne()
            .then(found => {
                if(found === undefined){
                    console.log('Could not find that user');
                } else {
                    console.log(found)
                }
                
            });            
    }).catch(e => console.log(e))

    res.status(200).send('Nothing probably broke');
});
 
export {router as authRouter}