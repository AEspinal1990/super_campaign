import "reflect-metadata";

/**
 * Import Libraries
 */
import * as express                     from 'express';
import * as bodyParser                  from 'body-parser';
import {createConnection, Connection}   from "typeorm";

/**
 * Import Route Handlers
 */
import { adminRouter }      from './routes/admin';
import { authRouter }       from './routes/authentication';
import { campaignRouter }   from './routes/campaign';

const app = express();

/**
 * Configurations
 */
app.set('port', process.env.PORT || 3000);
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());


/**
 * Use route handlers
 */
app.use('/user', adminRouter);
app.use('/campaign', campaignRouter);
app.use('/login', authRouter)

export default app;