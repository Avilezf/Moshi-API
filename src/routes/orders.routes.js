const { Router } = require('express');

const router = Router();

const { addOrders,
    updateOrders,
    deleteOrders
    } = require('../controllers/orders.controllers');

router.post('/addOrders', addOrders);
router.put('/updateOrders', updateOrders);
router.delete('/deleteOrders', deleteOrders);



module.exports = router;