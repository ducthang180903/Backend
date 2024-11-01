const express = require('express');
const { getproduct, postproduct, putproduct, deleteproduct, deleteproducts } = require('../controllers/productController');
const upload = require('../config/multerConfig');
const router = express.Router();


// Route để lấy danh sách SP
router.get('/sanpham', getproduct);

// Route để thêm SP
// router.post('/sanpham', upload, postproduct);
router.post('/sanpham', (req, res, next) => {
    upload(req, res, (err) => {
        if (err) {
            // Nếu có lỗi từ multer hoặc fileFilter
            return res.status(201).json({ warning: err.message });
        }
        // Nếu không có lỗi, tiếp tục với controller
        postproduct(req, res);
    });
});
// Route để sửa SP
router.put('/sanpham/:id', putproduct);

// Route để xóa SP
router.delete('/sanpham/:id', deleteproduct);
router.post('/sanpham/delete', deleteproducts);

module.exports = router;