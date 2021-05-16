const express = require('express');
const cors = require('cors');
const { dbConnection } = require('../../config/database/config.database');


class Server {

    constructor() {
        this.app = express();
        this.port = process.env.PORT;
        this.userPath = '/api/user';
        this.adminPath = '/api/admin';
        this.productPath = '/api/product';
        
        //database connection
        this.DBConnection();

        //middleware
        this.middleware();

        //routes
        this.routes();
    }

    DBConnection(){
        const pool = dbConnection();
    }

    routes() {
        this.app.use(this.userPath, require('../routes/user.routes'));
        this.app.use(this.adminPath, require('../routes/admin.routes'));
        this.app.use(this.productPath, require('../routes/product.routes'));
    }

    middleware(){
        //Cors
        this.app.use(cors());

        // Lectura y parseo del body
        this.app.use( express.json() );

        // Directorio Público
        this.app.use( express.static('public') );
    }

    listen () {
        this.app.listen(this.port , ()=> {
            console.log('listening on port', this.port);
        });
    }


}

module.exports = Server;