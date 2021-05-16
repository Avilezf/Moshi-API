const { Router } = require('express');
const { check } = require('express-validator');

const router = Router();

const { allBooksGet,
    categoryBooksGet,
    searchBooksGet,
    authorBooksGet
    } = require('../controllers/product.controllers');
const { validation } = require('../middleware/validation');

router.get('/', allBooksGet);
router.get('/category/:category', categoryBooksGet);
router.get('/author/:author', authorBooksGet);
router.get('/:search', searchBooksGet);



module.exports = router;