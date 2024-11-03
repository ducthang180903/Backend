
const express = require('express');
const { getproduct ,postproduct ,putproduct , deleteproduct } = require('../controllers/productController');
const router = express.Router();


// Route để lấy danh sách SP
router.get('/sanpham', getproduct);

// Route để thêm SP
router.post('/sanpham', postproduct);

// Route để sửa SP
router.put('/sanpham/:id', putproduct);

// Route để xóa SP
router.delete('/sanpham/:id', deleteproduct);

module.exports = router;