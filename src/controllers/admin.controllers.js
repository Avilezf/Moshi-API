const bcryptjs = require('bcryptjs');
const { generateJWT } = require('../helpers/generate-jwt');
const User = require('../models/user.models');
const Product = require('../models/product.models');
const { dbConnection } = require('../../config/database/config.database');
const Orders = require('../models/orders.models');

const selectAdminQuery = 'select * from users where username = $1';
const selectAll = 'select * from orders where status = $1';
const searchQuery = 'select * from product where productid = $1';
const insertQuery = 'INSERT INTO product (collection, editorial, isbn, title, author, price, quantity, category, rating, image) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)';
const deleteQuery = 'DELETE FROM product WHERE productid = $1';
const deleteQuery2 = 'DELETE FROM orders WHERE orderid = $1';
const deleteQuery3 = 'DELETE FROM cart WHERE orderid = $1';
const updateQuery = 'UPDATE product SET collection = $2, editorial = $3, isbn = $4, title = $5, author = $6, price = $7, quantity = $8, category = $9, rating = $10, image=$11 WHERE productid = $1';
const updateQuery2 = 'UPDATE orders SET status = $2 WHERE orderid = $1';

const pool = dbConnection();

//POST
//-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//                                                                                               ADD BOOK
//-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
const addBook = async (req, res = response) => {
    const { collection, editorial, isbn, title, author, price, quantity, category, rating, image } = req.body;
    const product = new Product(0, collection, editorial, isbn, title, author, price, quantity, category, rating, image);

    //Insert book into database
    await pool
        .query(insertQuery, product.toList2())
        .then(rest => {
            console.log(rest.rows[0])
            return res.status(201).json({
                msg: product.toValue()
            })
        })
        .catch(e => console.error(e.stack));

}


//Delete
//-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//                                                                                              DELETE BOOK
//-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

const deleteBook = async (req = request, res = response) => {
    const { productid } = req.headers;
    if (typeof productid == 'undefined') {
        return res.status(400).json({
            msg: 'You must send productid by headers'
        })
    }

    //Delete book into database
    await pool
        .query(deleteQuery, [productid])
        .then(rest => {
            console.log(rest.rows[0])
            return res.status(200).json({
                msg: 'Success'
            })
        })
        .catch(e => console.error(e.stack));

}

//PUT
//-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//                                                                                                  EDIT BOOK
//-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
const editBook = async (req, res = response) => {

    const { productid, collection, editorial, isbn, title, author, price, quantity, category, rating, image } = req.body;
    const productUpdate = new Product(productid, collection, editorial, isbn, title, author, price, quantity, category, rating, image);

    //Search the product in the database
    let product;
    let list;
    let auxProduct;

    await pool
        .query(searchQuery, [productUpdate.getProductId()])
        .then(rest => {
            auxProduct = rest.rows[0];
            console.log(auxProduct)
            if (typeof auxProduct == 'undefined') {
                return res.status(400).json({
                    msg: 'This product is not in the database'
                })
            }

        })
        .catch(e => console.error(e.stack));
    product = new Product(auxProduct.productid, auxProduct.collection, auxProduct.editorial, auxProduct.isbn, auxProduct.title, auxProduct.author, auxProduct.price, auxProduct.quantity, auxProduct.category, auxProduct.rating);

    //Update into models
    product.setCollection(productUpdate.getCollection());
    product.setEditorial(productUpdate.getEditorial());
    product.setISBN(productUpdate.getISBN());
    product.setTitle(productUpdate.getTitle());
    product.setAuthor(productUpdate.getAuthor());
    product.setPrice(productUpdate.getPrice());
    product.setQuantity(productUpdate.getQuantity());
    product.setCategory(productUpdate.getCategory());
    product.setRating(productUpdate.getRating());
    product.setRating(productUpdate.getRating());
    product.setImage(productUpdate.getImage());

    list = product.toList();
    //Update into database
    await pool
        .query(updateQuery, list)
        .then(rest => {
            console.log(rest.rows[0])
            return res.status(200).json({
                msg: 'Update Successfull'
            })
        })
        .catch(e => console.error(e.stack));


}

//-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//                                                                                              GET ORDERS
//-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

const getOrders = async (req, res = response) => {
    let params = req.params;

    let orders = []
    await pool
        .query(selectAll, [params.status])
        .then(rest => {
            for (let i = 0; i < rest.rows.length; i++) {
                if (rest.rows[i] == 'undefined') {
                    res.status(400).json({
                        msg: 'These no orders on the database'
                    })
                }
                let AuxOrders = rest.rows[i];
                let order = new Orders(AuxOrders.orderid, AuxOrders.userid, AuxOrders.status, AuxOrders.shippingid, AuxOrders.datecreated, AuxOrders.dateshipped, AuxOrders.paytype, AuxOrders.subtotal, AuxOrders.total);
                orders[i] = order.toJSON();

            }
        })
        .catch(e => console.error(e.stack));

    //Show Orders
    res.json({
        orders
    })

}

//----------------------------------------------------------------------------------------------------------------------------------------------------------   ---------------------------------------------------------------------------------
//                                                                                              UPDATE ORDER
//-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

const updateOrders = async (req, res = response) => {
    const { orderid, status } = req.headers;

    //Update ORDER into database
    await pool
        .query(updateQuery2, [orderid, status])
        .then(rest => {
            console.log(rest.rows[0])
        })
        .catch(e => {
            return res.status(500).json({
                msg: 'Error in the database process please check your settings',
                err: e.stack
            })
        });

    return res.status(202).json({
        msg: `Order: ${orderid} updated successfully`,
        status: status
    })


}

//-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//                                                                                              DELETE ORDER
//-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

const deleteOrders = async (req, res = response) => {
    const { orderid } = req.headers;

    if (typeof orderid == 'undefined') {
        return res.status(400).json({
            msg: 'You must send the orderid by headers'
        })
    }

    //Delete book into database
    await pool
        .query(deleteQuery3, [orderid])
        .then(rest => {
            console.log(rest.rows[0])
        })
        .catch(e => console.error(e.stack));

    await pool
        .query(deleteQuery2, [orderid])
        .then(rest => {
            console.log(rest.rows[0])
            return res.status(200).json({
                msg: 'Delete Success'
            })
        })
        .catch(e => console.error(e.stack));

}


//-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//                                                                                              LOGIN ADMIN USER
//-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------


const adminLogin = async (req, res = response) => {

    try {
        const { username, password } = req.body;

        //Searching user
        let auxUser;
        await pool
            .query(selectAdminQuery, [username])
            .then(res => {
                auxUser = res.rows[0]
            })
            .catch(e => console.error(e.stack));


        const user = new User(auxUser.username, auxUser.password, auxUser.role, auxUser.status, auxUser.email, auxUser.registerdate, auxUser.firstname, auxUser.lastname, auxUser.birthday, auxUser.shippinginfo, auxUser.creditinfo, auxUser.googleauth, auxUser.userid);

        //If status is True
        if (user.getRole() != 3) {
            return res.status(400).json({
                msg: 'Warning - invalid user. You are not allowed to use this login'
            });
        }

        //If status is True
        if (!user.getStatus()) {
            return res.status(400).json({
                msg: 'User status - invalid. Please contact with support'
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

module.exports = {
    addBook,
    deleteBook,
    editBook,
    getOrders,
    updateOrders,
    deleteOrders,
    adminLogin
}