import "reflect-metadata";

/**
 * Import Libraries
 */
import * as express             from 'express';
import * as bodyParser          from 'body-parser';
import * as methodOverride      from 'method-override'
import * as expressValidator    from 'express-validator';

var session     = require('express-session');
var MySQLStore  = require('express-mysql-session')(session);
var passport    = require('passport');
const winston   = require('winston');
const logger    = require('./util/logger');
const appLogger = winston.loggers.get('appLogger');

/**
 * Import Route Handlers
 */
import { adminRouter }      from './routes/admin';
import { authRouter }       from './routes/authentication';
import { campaignRouter }   from './routes/campaign';
import { managerRouter }    from './routes/manager';

const app = express();
 
/**
 * Configurations
 */
app.set('port', process.env.PORT || 8080);
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(expressValidator());    // This MUST come after bodyParser.
app.use(methodOverride('_method'));
const options = {
    host: '35.231.100.7',
    port: 3306,
    user: 'root',
    password: 'rng308',
    database: 'supercampaign'
}; 
const sessionStore = new MySQLStore(options);
app.use(session({
  secret: 'my super secret, secret, is a secret?',
  store: sessionStore,
  resave: false,
  saveUninitialized: false,
  //cookie: { secure: true } // Set to True when using https
}))
app.use(passport.initialize());
app.use(passport.session());
app.use((req, res, next) => {
  res.locals.isAuthenticated = req.isAuthenticated();
  next();
});

/**
 * Use route handlers
 */
app.use('/user', adminRouter);
app.use('/admin', adminRouter);
app.use('/global', adminRouter);
app.use('/campaign', campaignRouter);
app.use('/manager', managerRouter);
app.use('/', authRouter);

appLogger.info('Starting Application');
export default app;