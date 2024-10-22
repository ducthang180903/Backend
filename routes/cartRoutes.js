const express = require('express');
const { postcartProducts ,deleteCartProduct , getCart  } = require('../controllers/cartController');
const router = express.Router();



// Route để thêm SP
router.post('/cart', postcartProducts);
// Route để thêm SP
router.delete('/cart/:id', deleteCartProduct);

// Route để thêm SP
router.get('/cart', getCart);
module.exports = router;