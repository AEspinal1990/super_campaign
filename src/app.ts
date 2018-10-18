import "reflect-metadata";

/**
 * Import Libraries
 */
import * as express             from 'express';
import * as bodyParser          from 'body-parser';
// import * as morgan           from 'morgan';
import * as methodOverride      from 'method-override'
import * as expressValidator    from 'express-validator';

var session     = require('express-session');
var MySQLStore  = require('express-mysql-session')(session);
var passport    = require('passport');

/**
 * Import Route Handlers
 */
import { adminRouter }      from './routes/admin';
import { authRouter }       from './routes/authentication';
import { campaignRouter }   from './routes/campaign';

const app = express();

/////EXPERIMENT WITH MORGAN
/*
var fs = require('fs');
var morgan = require('morgan');
var path = require('path');

//Creating stream
var accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), {flags:'a'});
//setup the logger
app.use(morgan('combined', {stream:accessLogStream}))
*/

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
app.set('trust proxy', 1) // trust first proxy
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

/**
 * Use route handlers
 */
app.use('/user', adminRouter);
app.use('/admin', adminRouter);
app.use('/global', adminRouter);
app.use('/campaign', campaignRouter);
//app.use(morgan('/campaign' stream:__dirname + '/../log/morgan.log'), campaignRouter);
app.use('/', authRouter);

export default app;