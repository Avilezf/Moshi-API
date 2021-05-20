const { Pool, Client } = require('pg')
const connectionString = process.env.DATABASE_URL


function dbConnection() {

    try {
        const pool = new Pool({
            connectionString,
            // ssl: {
            //     rejectUnauthorized: false
            // }
        })
        console.log('Connected Database')
        return pool;

    } catch (error) {
        console.log(error);
        throw new Error('Database Connection Error')
    }


}

module.exports = {
    dbConnection
}




