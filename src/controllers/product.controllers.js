
const Product = require('../models/product.models');
const { dbConnection } = require('../../config/database/config.database');

const selectAll = 'select * from product';
const selectCategory = 'select * from product where category = $1';
const selectSearch = 'select * from product where title like $1';

const pool = dbConnection();


//GET
//-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//                                                                                              ALL BOOKS GET
//-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
const allBooksGet = async (req = request, res = response) => {

    let products = []
    await pool
        .query(selectAll)
        .then(rest => {
            for (let i = 0; i < rest.rows.length; i++) {
                if (rest.rows[i] == 'undefined') {
                    res.status(400).json({
                        msg: 'These no books on the database'
                    })
                }
                let books = rest.rows[i];
                let product = new Product(books.productid, books.collection, books.editorial, books.isbn, books.title, books.author, books.price, books.quantity, books.category, books.rating, books.image);
                products[i] = product.toJSON()
        
            }
        })
        .catch(e => console.error(e.stack));

    res.json({
        products
    })


}

//-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//                                                                                              ALL BOOKS GET
//-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

const categoryBooksGet = async (req = request, res = response) => {

    let params = req.params;

    let products = [];
    await pool
        .query(selectCategory, [params.category])
        .then(rest => {
            for (let i = 0; i < rest.rows.length; i++) {
                if (rest.rows[i] == 'undefined') {
                    res.status(400).json({
                        msg: 'These no books on the database'
                    })
                }
                let books = rest.rows[i];
                let product = new Product(books.productid, books.collection, books.editorial, books.isbn, books.title, books.author, books.price, books.quantity, books.category, books.rating, books.image);
                products[i] = product.toJSON()

            }
        })
        .catch(e => console.error(e.stack));

    res.json({
        products
    })

}

//-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//                                                                                              ALL BOOKS GET
//-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

const authorBooksGet = async (req = request, res = response) => {

    let params = req.params;

    let products = [];
    await pool
        .query(selectAuthor, [params.author])
        .then(rest => {
            for (let i = 0; i < rest.rows.length; i++) {
                if (rest.rows[i] == 'undefined') {
                    res.status(400).json({
                        msg: 'These no books on the database'
                    })
                }
                let books = rest.rows[i];
                let product = new Product(books.productid, books.collection, books.editorial, books.isbn, books.title, books.author, books.price, books.quantity, books.category, books.rating, books.image);
                products[i] = product.toJSON()

            }
        })
        .catch(e => console.error(e.stack));

    res.json({
        products
    })


}

//-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//                                                                                              ALL BOOKS GET
//-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

const searchBooksGet = async (req = request, res = response) => {
    let params = req.params;

    let products = [];
    await pool
        .query(selectSearch,[`${params.search}%`])
        .then(rest => {
            for (let i = 0; i < rest.rows.length; i++) {
                if (rest.rows[i] == 'undefined') {
                    res.status(400).json({
                        msg: 'These no books on the database'
                    })
                }
                let books = rest.rows[i];
                let product = new Product(books.productid, books.collection, books.editorial, books.isbn, books.title, books.author, books.price, books.quantity, books.category, books.rating, books.image);
                products[i] = product.toJSON();

            }
        })
        .catch(e => console.error(e.stack));

    res.json({
        products
    })



}

module.exports = {
    allBooksGet,
    categoryBooksGet,
    authorBooksGet,
    searchBooksGet
}