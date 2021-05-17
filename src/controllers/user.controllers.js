const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { generateJWT } = require('../helpers/generate-jwt');
const User = require('../models/user.models');
const { dbConnection } = require('../../config/database/config.database');


const insert = 'INSERT INTO users (username, password, role, email, status, registerDate, firstName, lastName, birthday, shippingInfo, creditInfo, googleAuth) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)'
const select = 'select * from users where username = $1';
const update = 'UPDATE users SET username = $1, password = $2, role = $3, email = $4, status = $5, registerDate = $6 ,firstName = $7, lastName = $8, birthday = $9, shippingInfo = $10,  creditInfo = $11, googleAuth = $12 where userid = $13';

const pool = dbConnection();
//Get
const userGet = async (req = request, res = response) => {

    const token = req.header('x-token');

    const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);

    //Search user in the database
    let user;
    await pool
        .query(select, [uid])
        .then(rest => {
            const auxUser = rest.rows[0];
            if (typeof auxUser != 'undefined') {
                user = new User(auxUser.username, auxUser.password, auxUser.role, auxUser.status, auxUser.email, auxUser.registerdate, auxUser.firstname, auxUser.lastname, auxUser.birthday, auxUser.shippinginfo, auxUser.creditinfo, auxUser.googleauth, auxUser.userid);
            } else {
                return res.status(401).json({
                    msg: 'Token invalid - user not exists in the DB'
                })
            }

        })
        .catch(e => console.error(e.stack));
        let userJSON = user.toJSON();
    return res.json({
        userJSON
    });
}

//POST
//-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//                                                                                              REGISTER USER
//-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
const userRegister = async (req, res = response) => {
    const { username, password, email, firstname, lastname, birthday } = req.body;
    const user = new User(username, password, 1, true, email, '10-10-21', firstname, lastname, birthday, undefined, undefined, undefined, undefined);

    //Encrypt password
    const salt = bcryptjs.genSaltSync();
    user.setPassword(bcryptjs.hashSync(user.getPassword(), salt));

    //Insert user into database
    await pool
        .query(insert, user.toList())
        .then(res => {
            console.log(res.rows[0]);
        })
        .catch(e => console.error(e.stack));
    res.json({
        msg: user.toValue()
    })

}

//-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//                                                                                              LOGIN USER
//-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------


const userLogin = async (req, res = response) => {

    try {
        const { username, password } = req.body;

        //Searching user
        let auxUser;
        await pool
            .query(select, [username])
            .then(res => {
                auxUser = res.rows[0]
            })
            .catch(e => console.error(e.stack));

        //Verify if username exists
        if (typeof auxUser == 'undefined') {
            return res.json({
                msg: 'Username not found'
            })
        }
        const user = new User(auxUser.username, auxUser.password, auxUser.role, auxUser.status, auxUser.email, auxUser.registerdate, auxUser.firstname, auxUser.lastname, auxUser.birthday, auxUser.shippinginfo, auxUser.creditinfo, auxUser.googleauth, auxUser.userid);


        //If status is True
        if (!user.getStatus()) {
            return res.status(400).json({
                msg: 'user status - invalid. Please contact with support'
            });
        }

        //Verify password
        const validPassword = bcryptjs.compareSync(password, user.getPassword());
        if (!validPassword) {
            return res.status(400).json({
                msg: 'Password is incorrect'
            });
        }

        //Generate JWT
        const token = await generateJWT(user.getUserId());

        res.json({
            msg: user.toValue(),
            token: token
        })

    } catch (e) {
        console.log(e);
        res.status(500).json({
            msg: 'Important! Please contact with support'
        });
    }

}

//-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//                                                                                              NEW PASSWORD USER
//-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

const userForgotPassword = (req, res = response) => {

}


//PUT
//-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//                                                                                              UPDATE USER
//-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

const userUpdate = async (req, res = response) => {

    const { username } = req.params;
    const body = req.body;
    const user2 = new User(body.username, body.password, body.role, body.status, body.email, body.registerdate, body.firstname, body.lastname, body.birthday, body.shippinginfo, body.creditinfo, body.googleauth, body.userid);

    //Encrypt password
    if (body.password) {
        //Encrypt password
        const salt = bcryptjs.genSaltSync();
        user2.setPassword(bcryptjs.hashSync(user2.getPassword(), salt));
    }

    //Creating user into models
    let auxUser;
    await pool
        .query(select, [username])
        .then(res => {
            auxUser = res.rows[0];
        })
        .catch(e => console.error(e.stack));

    if (typeof auxUser === 'undefined') {
        return res.status(206).json({
            msg: 'The username is not in the database'
        })
    }

    let user;
    if (typeof auxUser != 'undefined') {
        user = new User(auxUser.username, auxUser.password, auxUser.role, auxUser.status, auxUser.email, auxUser.registerdate, auxUser.firstname, auxUser.lastname, auxUser.birthday, auxUser.shippinginfo, auxUser.creditinfo, auxUser.googleauth, auxUser.userid);

        const findEmail = 'SELECT userid, email FROM users WHERE email = ($1)'
        const findUsername = 'SELECT userid, username FROM users WHERE username = ($1)'

        //Verify New Email
        let auxEmail;
        await pool
            .query(findEmail, [user2.getEmail()])
            .then(res => {
                auxEmail = res.rows[0];
            })
            .catch(e => console.error(e.stack));
        if (typeof auxEmail != 'undefined') {
            if (auxEmail.userid != user.getUserId()) {
                return res.status(206).json({
                    msg: 'The email is already in use'
                })
            }
        }


        //verify New Username
        let auxUsername;
        await pool
            .query(findUsername, [user2.getUsername()])
            .then(res => {
                auxUsername = res.rows[0];
            })
            .catch(e => console.error(e.stack));

        if (typeof auxUsername != 'undefined') {
            if (auxUsername.userid != user.getUserId()) {
                return res.status(206).json({
                    msg: 'The username is already in use'
                })
            }
        }

        user.setUsername(user2.getUsername());
        user.setPassword(user2.getPassword());
        user.setEmail(user2.getEmail());
        user.setFirstName(user2.getFirstName());
        user.setLastName(user2.getLastName());
        user.setBirthday(user2.getBirthday());
    } else {
        res.status(206).json({
            msg: 'The id is invalid'
        })
        throw new Error('The id is invalid');

    }


    //Update user into database
    let list = user.toList();
    list.push(user.getUserId());
    await pool
        .query(update, list)
        .then(res => {
            console.log(res.rows[0] + ' done!')
        })
        .catch(e => console.error(e.stack));


    res.json({
        msg: user.toValue(),
        status: 'success'
    });

}

const userPatch = (req, res = response) => {
    res.json({
        msg: 'patch API - usuariosPatch'
    });
}

const userDelete = (req, res = response) => {
    res.json({
        msg: 'delete API - usuariosDelete'
    });
}


module.exports = {
    userGet,
    userLogin,
    userUpdate,
    userPatch,
    userDelete,
    userRegister
}