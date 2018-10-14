import app from './app';
import * as fs from 'fs';
import * as https from 'https';
import { createConnection, Connection, getConnection, getRepository } from "typeorm";

/**
 * Only one of these servers can be uncommented at a time.
 * HTTPS server requires accepting a exception on the certification 
 * but I think the professor said thats ok.
 */


// const server2 = https.createServer({
//     key: fs.readFileSync('server.key'),
//     cert: fs.readFileSync('server.cert')
// }, app)
// .listen(app.get('port'), () => {
//     console.log('App is running on port', app.get('port'), app.get('env'))
// });


/**
 * Create Connection to the Database
 */
let server;
const connection = createConnection().then(async (connection) => {
    console.log(`Connection to ${connection.options.database} established`);
    server = app.listen(app.get('port'), () => {
        console.log('App is running on port', app.get('port'), app.get('env'))
    });
});

// let server3 = app.listen(app.get('port'), () => {
//     console.log('App is running on port', app.get('port'), app.get('env'))
// });



export default server;

