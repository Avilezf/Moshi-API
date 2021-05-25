const jwt = require('jsonwebtoken');

const { generateJWT } = require('../helpers/generate-jwt');
const Cart = require('../models/cart.models');
const Orders = require('../models/orders.models');
const Shipping = require('../models/shipping.models');
const Product = require('../models/product.models');
const { dbConnection } = require('../../config/database/config.database');

const insert = 'INSERT INTO orders (userid, status, shippingid, datecreated, dateshipped, paytype, subtotal, total) VALUES($1, $2, $3, $4, $5, $6, $7, $8) returning orderid'
const insert2 = 'INSERT INTO cart (orderid, productid, quantity) VALUES($1, $2, $3) '
const update = 'UPDATE product SET quantity = $2 WHERE productid = $1'
const select2 = 'select * from shipping where shippingid = $1'
const select3 = 'select * from product where productid in'
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
            console.log(e.stack)
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
            console.log(e.stack)
        });


    //Create the model CART
    let listProductsId = [];
    cart.forEach(product => {
        listProductsId.push(product.productId);
    });

    //Verify if the product exists
    exist = true;
    let products = []
    await pool
        .query(`${select3} (${listProductsId})`)
        .then(rest => {
            if (typeof rest.rows == 'undefined' || rest.rows.length != listProductsId.length) {
                exist = false;
            } else {
                for (let i = 0; i < rest.rows.length; i++) {
                    if (rest.rows[i] == 'undefined') {
                        res.status(400).json({
                            msg: 'These no books on the database'
                        })
                    }
                    let books = rest.rows[i];
                    let product = new Product(books.productid, books.collection, books.editorial, books.isbn, books.title, books.author, books.price, books.quantity, books.category, books.rating, books.image);
                    products[i] = product

                }
            }
        })
        .catch(e => {
            return res.status(500).json({
                msg: 'Error in the database process please check your settings',
                err: e.stack
            })
        });

    if (exist) {
        cart.forEach(async product => {
            let cart2 = new Cart(0, auxOrderId.orderid, product.productId, product.quantity);
            let num;

            for (let i = 0; i < products.length; i++) {
                if (products[i].getProductId() === product.productId) {
                    let inv = products[i].getQuantity() - product.quantity;
                    if (inv < 0) {
                        return res.status(500).json({
                            msg: 'To much product, we do not have enough',
                        })
                    } else {
                        products[i].setQuantity(inv);
                        num = i;
                    }

                }
            }

            //Update quantity on PRODUCT
            await pool
                .query(update, [products[num].getProductId(), products[num].getQuantity()])
                .then(rest => {
                    console.log('Update product: ' + product.productId);
                })
                .catch(e => {
                    console.log(e.stack)
                });



            //Insert CART into database
            await pool
                .query(insert2, cart2.toList())
                .then(rest => {
                    console.log('Insert on: ' + auxOrderId.orderid);
                })
                .catch(e => {
                    console.log(e.stack)
                });
        });

        return res.status(201).json({
            msg: orders.toValue(),
            resp: 'Order Save',
            order: auxOrderId
        })


    } else {

        await pool
            .query(delete2, [auxOrderId.orderid])
            .then(rest => {
                console.log('Error Controlled', rest.rows[0]);
            })
            .catch(e => {

            });

        return res.status(501).json({
            resp: 'Error Controlled one product do not exists'
        })

    }


}



module.exports = {
    addOrders
}