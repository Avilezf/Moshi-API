const { Router } = require('express');
const { check } = require('express-validator');

const router = Router();

const { userGet,
    userUpdate,
    userRegister,
    userDelete,
    userLogin,
    userPatch } = require('../controllers/user.controllers');
const { verifyEmail, verifyUsername } = require('../helpers/db-validators');
const { validation } = require('../middleware/validation');
const { validationJWT } = require('../middleware/validation-jwt');


router.get('/', userGet);

router.put('/:username', [
    check('username', 'username is required').not().isEmpty(),
    check('firstname', 'firstname is required').not().isEmpty(),
    check('lastname', 'lastname is required').not().isEmpty(),
    check('birthday', 'birthday is required').not().isEmpty(),
    check('password', 'password is required, minimum 6 characters required').not().isEmpty().isLength({ min: 6 }),
    check('email', 'Email is not valid').isEmail(),
    validationJWT,
    validation
],userUpdate);

router.post('/login', [
    check('username', 'username is required').not().isEmpty(),
    check('password', 'password is required').not().isEmpty(),  
    validation
],userLogin );

router.post('/', [
    check('username', 'username is required').not().isEmpty(),
    check('password', 'password is required, minimum 6 characters required').not().isEmpty().isLength({ min: 6 }),
    check('email', 'Email is not valid').isEmail(),
    check('email', 'Email already exist').custom(verifyEmail),
    check('username', 'Username already exist').custom(verifyUsername),
    validation
], userRegister);

router.delete('/', [
    validationJWT,
    validation
],userDelete);



module.exports = router;