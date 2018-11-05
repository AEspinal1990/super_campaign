import { Request, Response, Router } from 'express';
const passport  = require('passport');
const router: Router = Router();


const winston = require('winston');
const logger = require('../util/logger');
const authLogger = winston.loggers.get('authLogger');


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

// TODO: leave a better message on log
router.get('/logout', (req: Request, res: Response) => {
    console.log(req.user)
    authLogger.info(`/logout - ${req.user._username}`);
    req.logout();
    // @ts-ignore
    req!.session!.destroy();
    res.redirect('/');
});

router.get('/temp',(req: Request, res: Response) => {
    authLogger.info(`/login -${req.user._username}`);
    res.send('Logged In Successfully!');
});
 
export {router as authRouter}