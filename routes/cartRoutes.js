const express = require('express');
const { postcartProducts   } = require('../controllers/cartController');
const router = express.Router();


// Route để thêm SP
router.post('/cart', postcartProducts);
// Route để thêm SP
// router.delete('/cart/:id', deleteCartProduct);

// Route để thêm SP
// router.get('/cart', getCart);
// ,deleteCartProduct , getCart
module.exports = router;