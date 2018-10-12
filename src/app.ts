import "reflect-metadata";

/**
 * Import Libraries
 */
import * as express from 'express';
import * as bodyParser from 'body-parser';


/**
 * Import Route Handlers
 */
import * as adminRoutes from './routes/admin'
import * as campaignRoutes from './routes/campaign'


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
app.get('/', adminRoutes.home);
app.get('/adduser', adminRoutes.createUserPage);
// Campaign
app.get('/createcampaign', campaignRoutes.createCampaignPage);
app.post('/createcampaign',campaignRoutes.createCampaign);


export default app;