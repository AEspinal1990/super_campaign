import express = require('express');
 
import * as statusController from './controllers/status'
import "reflect-metadata";

const app = express();
app.set('port', process.env.PORT || 3000);

app.get('/', statusController.hi);

export default app;