import app from './app';
import * as fs from 'fs';
import * as https from 'https';
import { createConnection } from "typeorm";
import { isObject } from 'util';

var socket = require('socket.io');

/**
 * Only one of these servers can be uncommented at a time.
 * HTTPS server requires accepting a exception on the certification 
 * but I think the professor said thats ok.
 */
// let server2;
// const connection2 = createConnection().then(async (connection) => {
//     console.log(`Connection to ${connection.options.database} established`);
//     server2 = https.createServer({
//         key: fs.readFileSync('server.key'),
//         cert: fs.readFileSync('server.cert')
//     }, app).listen(app.get('port'), () => {
//         console.log('App is running on port', app.get('port'), app.get('env'))
//     });
// }).catch(e => console.log(e));

/**
 * Create Connection to the Database
 */
let server;
export let io;
const connection = createConnection().then(async (connection) => {
     console.log(`Connection to ${connection.options.database} established`);
    //  server = app.listen(app.get('port'), () => {
        //  console.log('App is running on port', app.get('port'), app.get('env'))
    //  });
    server = app.listen(app.get('port'), function(){
        console.log('App is running on port', app.get('port'), app.get('env'));
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
      });
      
    
 }).catch(e => console.log(e));

export default server;