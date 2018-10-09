import "reflect-metadata";
import * as express from 'express';

// Import route hanlders
import * as adminRoutes from './routes/admin'

const app = express();
app.set('port', process.env.PORT || 3000);


/**
 * Primary app routes
 */
app.get('/', adminRoutes.home);
app.post('/adduser', adminRoutes.addUser);

export default app;