const { Router } = require('express');
const { check } = require('express-validator');

const router = Router();

const { addBook,
    deleteBook,
    editBook,
    updateOrders,
    deleteOrders,
    getOrders,
    adminLogin} = require('../controllers/admin.controllers');
const { validation,
    validationJWT,
    validationOrder,
    validationRole
} = require('../middleware/index')
const { verifyBook } = require('../helpers/db-validators');


router.put('/editBook/:productid', [
    check('productid', 'product is required').not().isEmpty(),
    check('collection', 'collection is required').not().isEmpty(),
    check('editorial', 'editorial is required').not().isEmpty(),
    check('isbn', 'isbn is required').not().isEmpty(),
    check('title', 'title is required').not().isEmpty(),
    check('author', 'author is required').not().isEmpty(),
    check('price', 'price is required').not().isEmpty(),
    check('quantity', 'quantity is required').not().isEmpty(),
    check('category', 'category is required').not().isEmpty(),
    check('rating', 'rating is required').not().isEmpty(),    
    validationJWT,
    validationRole,
    validation
],editBook);

router.post('/', [
    check('username', 'username is required').not().isEmpty(),
    check('password', 'password is required').not().isEmpty(),
    validation
],adminLogin );

router.post('/addBook', [
    check('collection', 'collection is required').not().isEmpty(),
    check('editorial', 'editorial is required').not().isEmpty(),
    check('isbn', 'isbn is required').not().isEmpty(),
    check('title', 'title is required').not().isEmpty(),
    check('author', 'author is required').not().isEmpty(),
    check('price', 'price is required').not().isEmpty(),
    check('quantity', 'quantity is required').not().isEmpty(),
    check('category', 'category is required').not().isEmpty(),
    check('rating', 'rating is    required').not().isEmpty(),
    check('isbn').custom(verifyBook),
    validationJWT,
    validationRole,
    validation
], addBook);

router.delete('/deleteBook',[
    validationJWT,
    validationRole,
    validation
], deleteBook);

router.put('/updateOrders', [
    validationJWT,
    validationRole,
    validationOrder,
    validation
],updateOrders);


router.delete('/deleteOrders', [
    validationJWT,
    validationRole,
    validation
],deleteOrders);

router.get('/getOrders/:status', [
    validationJWT,
    validationRole,
    validation
],getOrders);



module.exports = router;