const { Router } = require('express');
const { validation,
    validationJWT,
} = require('../middleware/index')

const router = Router();

const { addOrders,
    } = require('../controllers/orders.controllers');

router.post('/addOrders',[
    validationJWT,
    validation
], addOrders);

module.exports = router;