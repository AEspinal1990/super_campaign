import "reflect-metadata";

/**
 * Import Libraries
 */
import * as express from 'express';
import * as bodyParser from 'body-parser';
import {createConnection, Connection} from "typeorm";


/**
 * Import Route Handlers
 */
import * as adminRoutes from './routes/admin';
import { authRouter } from './routes/authentication';
import { campaignRoute } from './routes/campaign';

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
 * Primary app routes
 */
// Admin
app.get('/adduser', adminRoutes.createUserPage);
app.post('/adduser', adminRoutes.createUser);
// Campaign
// app.get('/createcampaign', campaignRoutes.createCampaignPage);
// app.post('/createcampaign',campaignRoutes.createCampaign);


app.use('/campaign', campaignRoute);
app.use('/login', authRouter)

export default app;