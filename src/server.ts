import app from './app';
import * as fs from 'fs';
import * as https from 'https';
import { createConnection } from "typeorm";
import { isObject } from 'util';

var socket = require('socket.io');

/**
 * Create Connection to the Database
 */
let server;
export let server_1;
export let io;
const connection = createConnection().then(async (connection) => {
     console.log(`Connection to ${connection.options.database} established`);
    
    server = app.listen(app.get('port'), function(){
        console.log('App is running on port', app.get('port'), app.get('env'));
      });
    
    io = require('socket.io').listen(server);

 }).catch(e => console.log(e));

export default server;