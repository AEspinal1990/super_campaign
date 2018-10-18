import { Request, Response, Router } from 'express';
import { User } from "../backend/entity/User";
import { createConnection, getConnection, getManager } from "typeorm";
const passport  = require('passport');

const router: Router = Router();

/**
 * GET and POST routes for Log In / Authentications
 */
router.get('/', (req: Request, res: Response) => {
    res.render('login');
});



router.post('/', passport.authenticate(
    'local', {
        successRedirect: '/temp',
        failureRedirect: '/'
    }
));

router.get('/logout', (req: Request, res: Response) => {
    req.logout();
    // @ts-ignore
    req!.session!.destroy();
    res.redirect('/');
});

router.get('/temp',(req: Request, res: Response) => {
    console.log('Here');
    res.send('Logged In Successfully!');
});
 
export {router as authRouter}