import { Request, Response, Router } from 'express';
const passport  = require('passport');
const { createLogger, format, transports } = require('winston');
const router: Router = Router();

const fs = require('fs');
const path = require('path');
const env = process.env.NODE_ENV || 'development';
const logDir = 'log';


// Create the log directory if it does not exist
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

const filename = path.join(logDir, 'authentication.log');

const logger = createLogger({
  // change level if in dev environment versus production
  level: env === 'development' ? 'debug' : 'info',
  format: format.combine(
    format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss'
    }),
    format.printf(info => `${info.timestamp} ${info.level}: ${info.message}`)
  ),
  transports: [
    new transports.Console({
      level: 'info',
      format: format.combine(
        format.colorize(),
        format.printf(
          info => `${info.timestamp} ${info.level}: ${info.message}`
        )
      )
    }),
    new transports.File({ filename })
  ]
});

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
    logger.info('Logged out User');
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