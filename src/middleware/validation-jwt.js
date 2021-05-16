const { response, request } = require('express');
const User = require('../models/user.models');
const jwt = require('jsonwebtoken');
const { dbConnection } = require('../../config/database/config.database');

const select = 'select * from users where userid = $1'

const validationJWT = async(req = request, res = response, next) => {

    const token = req.header('x-token');

    if (!token) {
        return res.status(401).json({
            msg: 'No token provided'
        });
    }

    try {

        const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);

        //Search user in the database
        let user;
        const pool = dbConnection();
        await pool
            .query(select, [uid])
            .then(res => {
                const auxUser = res.rows[0];
                if(typeof auxUser != 'undefined'){
                    user = new User(auxUser.username, auxUser.password, auxUser.role, auxUser.status, auxUser.email, auxUser.registerdate, auxUser.firstname, auxUser.lastname, auxUser.birthday, auxUser.shippinginfo, auxUser.creditinfo, auxUser.googleauth, auxUser.userid);
                }else{
                    return res.status(401).json({
                        msg: 'Token invalid - user not exists in the DB'
                    })
                }
                
            })
            .catch(e => console.error(e.stack));

        //Verify if uid status is true 
        if(!user.getStatus()){
            return res.status(401).json({
                msg: 'Token invalid - user not valid'
            })
        }
        
        req.user = user;
        next();

    } catch (error) {
        console.log(error);
        res.status(401).json({
            msg: 'Invalid token'
        })

    }

}

module.exports = {
    validationJWT
}