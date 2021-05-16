const { Pool,  Client } = require('pg')
const connectionString = process.env.PG_CONNECTION


 function dbConnection() {

    try {
        const pool = new Pool({
            connectionString,
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




