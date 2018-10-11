import "reflect-metadata";

import * as express from 'express';
import * as bodyPraser from 'body-parser';

// Import route handlers
import * as adminRoutes from './routes/admin'
import * as campaignRoutes from './routes/campaign'

const app = express();



/**
 * Configurations
 */
app.set('port', process.env.PORT || 3000);
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyPraser.urlencoded({extended: true}));

/**
 * Primary app routes
 */
app.get('/', adminRoutes.home);
app.get('/createcampaign', campaignRoutes.createCampaignGET);
app.post('/createCampaignPOST',campaignRoutes.createCampaignPOST);
// app.post('/adduser', adminRoutes.addUser);


// const server = app.listen(app.get('port'), () => {
//     console.log('App is running on port', app.get('port'), app.get('env'))
// })

export default app;