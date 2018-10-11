import "reflect-metadata";

import * as express from 'express';

// Import route hanlders
import * as adminRoutes from './routes/admin'
import * as campaignRoutes from './routes/campaign'

const app = express();



/**
 * Configurations
 */
app.set('port', process.env.PORT || 3000);
app.set('view engine', 'ejs');
app.use(express.static('public'));

/**
 * Primary app routes
 */
app.get('/', adminRoutes.home);
app.get('/createcampaign', campaignRoutes.createCampaign);
// app.post('/adduser', adminRoutes.addUser);


// const server = app.listen(app.get('port'), () => {
//     console.log('App is running on port', app.get('port'), app.get('env'))
// })

export default app;