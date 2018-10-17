import "reflect-metadata";

/**
 * Import Libraries
 */
import * as express         from 'express';
import * as bodyParser      from 'body-parser';
// import * as morgan          from 'morgan';
import * as methodOverride  from 'method-override'


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
app.use(methodOverride('_method'));


/**
 * Use route handlers
 */
app.use('/user', adminRouter);
app.use('/admin', adminRouter);
app.use('/global', adminRouter);
app.use('/campaign', campaignRouter);
//app.use(morgan('/campaign' stream:__dirname + '/../log/morgan.log'), campaignRouter);
app.use('/login', authRouter);

export default app;