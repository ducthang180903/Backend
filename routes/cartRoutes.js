const express = require('express');
const { postcartProducts,getCart, deleteCartProduct  } = require('../controllers/cartController');
const cartRoutes = express.Router();


// Route để thêm SP
// router.post('/cart', postcartProducts);
cartRoutes.post('/cart', async (req, res) => {
    return await postcartProducts(req, res);
});
// Route để thêm SP
// router.delete('/cart/:sanPhamId', deleteCartProduct);
cartRoutes.delete('/cart/:sanPhamId', async (req, res) => {
    return await deleteCartProduct(req, res);
});

// Route để thêm SP
// router.get('/cart', getCart);

cartRoutes.get('/cart', async (req, res) => {
    return await getCart(req, res);
});
// ,deleteCartProduct , getCart
module.exports = cartRoutes;