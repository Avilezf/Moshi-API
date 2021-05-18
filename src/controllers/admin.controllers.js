const bcryptjs = require('bcryptjs');
const { generateJWT } = require('../helpers/generate-jwt');
const User = require('../models/user.models');
const Product = require('../models/product.models');
const { dbConnection } = require('../../config/database/config.database');

const selectAdminQuery = 'select * from users where username = $1';
const searchQuery = 'select * from product where productid = $1';
const insertQuery = 'INSERT INTO product (collection, editorial, isbn, title, author, price, quantity, category, rating) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9)';
const deleteQuery = 'DELETE FROM product WHERE productid = $1';
const updateQuery = 'UPDATE product SET collection = $2, editorial = $3, isbn = $4, title = $5, author = $6, price = $7, quantity = $8, category = $9, rating = $10 WHERE productid = $1';

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
    adminLogin
}