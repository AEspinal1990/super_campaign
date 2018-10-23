import app from './app';
import * as fs from 'fs';
import * as https from 'https';
import { createConnection } from "typeorm";

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
const connection = createConnection().then(async (connection) => {
     console.log(`Connection to ${connection.options.database} established`);
    //  server = app.listen(app.get('port'), () => {
        //  console.log('App is running on port', app.get('port'), app.get('env'))
    //  });
    const serv = app.listen(app.get('port'), function(){
        console.log('App is running on port', app.get('port'), app.get('env'));
      });
    var io = socket(serv);
    io.on('connection', function(socket){
        console.log("Made socket connect!");
    })
 }).catch(e => console.log(e));

export default server;

