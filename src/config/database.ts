import { createConnection, Connection } from "typeorm";

export const database = async () => {
    let connection:Connection= await createConnection();
    console.log('created a connection')
    return connection;
}