const jwt = require('jsonwebtoken');

const { generateJWT } = require('../helpers/generate-jwt');
const Cart = require('../models/cart.models');
const Orders = require('../models/orders.models');
const Shipping = require('../models/shipping.models');
const { dbConnection } = require('../../config/database/config.database');

const insert = 'INSERT INTO orders (userid, status, shippingid, datecreated, dateshipped, paytype, subtotal, total) VALUES($1, $2, $3, $4, $5, $6, $7, $8) returning orderid'
const insert2 = 'INSERT INTO cart (orderid, productid, quantity) VALUES($1, $2, $3) '
const select2 = 'select * from shipping where shippingid = $1'
const select3 = 'select * from product where productid = $1'
const delete2 = 'DELETE FROM orders where orderid = $1'
const pool = dbConnection();


//POST
//-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//                                                                                              ADD ORDERS
//-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
const addOrders = async (req, res = response) => {
    const { shippingId, cart, subtotal } = req.body;

    //Search UserId by Auth
    const token = req.header('x-token');
    const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);
    let userId = uid;

    //Search SHIPPING Cost by ShippingId 
    let shipping;
    await pool
        .query(select2, [shippingId])
        .then(rest => {
            const auxShipping = rest.rows[0];
            if (typeof auxShipping != 'undefined') {
                shipping = new Shipping(auxShipping.shippingid, auxShipping.shippingtype, auxShipping.shippingcost);
            } else {
                return res.status(401).json({
                    msg: 'the chosen Shipping is invalid - user not exists in the DB'
                })
            }

        })
        .catch(e => {
            return res.status(500).json({
                msg: 'Error in the database process please check your settings',
                err: e.stack
            })
        });

    let total = shipping.getShippingCost() + subtotal;

    //Create the model ORDER
    const orders = new Orders(0, userId, 0, shippingId, '10-10-21', null, 0, subtotal, total);

    //Insert ORDER into database
    let auxOrderId;
    await pool
        .query(insert, orders.toList())
        .then(rest => {
            auxOrderId = rest.rows[0];
        })
        .catch(e => {
            return res.status(500).json({
                msg: 'Error in the database process please check your settings',
                err: e.stack
            })
        });


    //Create the model CART
    let blocked = false;
    cart.forEach(product => {

        //Verify if the product exists
        exist = true;
        pool
            .query(select3, product.productId)
            .then(rest => {
                if (typeof rest.rows[0] === 'undefined') {
                    exist = false;
                    console.log(exist)
                }
            })
            .catch(e => {

            });

        if (exist && !blocked) {
            let cart2 = new Cart(0, auxOrderId.orderid, product.productId, product.quantity);

            //Insert CART into database
            pool
                .query(insert2, cart2.toList())
                .then(rest => {
                    console.log('Insertado: ' + rest.rows[0]);
                })
                .catch(e => {

                });



        } else {
            blocked = true;
            pool
                .query(delete2, [auxOrderId.orderid])
                .then(rest => {
                    console.log('Error Controlled', rest.rows[0]);
                })
                .catch(e => {

                });
        }

    });

    console.log(blocked)
    if (blocked) {
        return res.status(501).json({
            resp: 'Error Controlled Product do not exists'
        })
    } else {
        return res.status(201).json({
            msg: orders.toValue(),
            resp: 'Order Save',
            order: auxOrderId
        })

    }








}

//----------------------------------------------------------------------------------------------------------------------------------------------------------   ---------------------------------------------------------------------------------
//                                                                                              UPDATE ORDER
//-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

const updateOrders = async (req, res = response) => {


}

//-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//                                                                                              DELETE ORDER
//-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

const deleteOrders = async (req, res = response) => {


}

module.exports = {
    addOrders,
    updateOrders,
    deleteOrders
}