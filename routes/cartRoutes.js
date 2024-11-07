const express = require('express');
const { postcartProducts,getCart, deleteCartProduct  } = require('../controllers/cartController');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');



// Route để thêm SP
router.post('/cart',postcartProducts);
// Route để thêm SP
router.delete('/cart' ,deleteCartProduct);

// Route để thêm SP
router.get('/cart',authMiddleware, getCart);
// ,deleteCartProduct , getCart
module.exports = router;