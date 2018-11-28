import { Request, Response, Router } from 'express';
const passport  = require('passport');
const router: Router = Router();

const logger = require('../util/logger');
const authLogger = logger.getLogger('authLogger');


/**
 * GET and POST routes for Log In / Authentications
 */
router.get('/', (req: Request, res: Response) => {
    // res.render('login', {message: ""});
    res.render('login');
});


router.post('/', passport.authenticate(
    'local', {
        successRedirect: '/main',
        failureRedirect: '/',
        failureFlash: true
    }
));

// TODO: leave a better message on log
router.get('/logout', (req: Request, res: Response) => {
    if(req.user === undefined)
        return res.redirect('/');
    authLogger.info(`/logout - ${req.user[0]._username}`);
    req.logout();
    // @ts-ignore
    req!.session!.destroy();
    res.redirect('/');
});

router.get('/main',(req: Request, res: Response) => {
    authLogger.info(`/login -${req.user[0]._username}`);
    if (req.user[0]._permission === 1) {
        return res.redirect('/campaign/home');
    }
    res.render('main-screen');
});
 
export {router as authRouter}