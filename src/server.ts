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
    //  server = app.listen(app.get('port'), () => {
        //  console.log('App is running on port', app.get('port'), app.get('env'))
    //  });
    
    server = app.listen(app.get('port'), function(){
        console.log('App is running on port', app.get('port'), app.get('env'));
      });
    
    io = require('socket.io').listen(server);

      /*
    var http = require('http');
    server_1 = http.createServer(app);
    io = require('socket.io').listen(server_1);
    server_1.listen(3000);
    console.log('listening at 3000');
    --------------------------------------
    io = socket(server);
    io.on('connection', function(sock){ 
        console.log("Made socket connection!");
        sock.on('room', function(room){
            
            sock.join(room);
        });
        sock.on('disconnect', function(){
            console.log("Connection disconnected");
        });
    })
    */

 }).catch(e => console.log(e));

export default server;