
const express = require('express');
const { getproduct ,postproduct ,putproduct , deleteproduct , getProductById , searchProducts } = require('../controllers/productController');
const router = express.Router();
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

// Route để lấy danh sách SP
router.get('/sanpham', getproduct);


router.get('/search', searchProducts); 
// Đường dẫn để hiển thị sản phẩm theo SanPhamId
router.get('/sanpham/:id', getProductById);


// Route để thêm SP
// router.post('/sanpham', postproduct);
router.post('/sanpham', upload.array('HinhAnh'),postproduct);
// Route để sửa SP
router.put('/sanpham/:id', putproduct);

// Route để xóa SP
router.delete('/sanpham/:id', deleteproduct);

module.exports = router;