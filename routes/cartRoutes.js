const express = require('express');
const { postcartProducts, getCart, deleteCartProduct, updateCartProduct } = require('../controllers/cartController');
const cartRoutes = express.Router();

cartRoutes.get('/', async (req, res) => {
    return await getCart(req, res);
});

cartRoutes.post('/', async (req, res) => {
    return await postcartProducts(req, res);
});

cartRoutes.put('/', async (req, res) => {
    return await updateCartProduct(req, res);
});

cartRoutes.delete('/cart', async (req, res) => {
    return await deleteCartProduct(req, res);
});



module.exports = cartRoutes;