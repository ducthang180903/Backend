const express = require('express');
const productRouter = express.Router();
const { getproduct, postproduct, putproduct, deleteproduct, deleteproducts, searchProducts, getProductById } = require('../controllers/productController');
const upload = require('../config/multerConfig');

productRouter.get('/sanpham', async (req, res) => {
    return await getproduct(req, res);
});

productRouter.get('/sanpham/:id', async (req, res) => {
    return await getProductById(req, res);
});
productRouter.get('/search', async (req, res) => {
    return await searchProducts(req, res);
});
// Route để thêm SP
productRouter.post('/sanpham', (req, res) => {
    upload(req, res, async (err) => {
        if (err) {
            // Nếu có lỗi từ multer hoặc fileFilter
            return res.status(201).json({ warning: err.message });
        }
        // Nếu không có lỗi, tiếp tục với controller
        return await postproduct(req, res);
    });
});

// Route để sửa SP
productRouter.put('/sanpham/:id', async (req, res) => {
    upload(req, res, async (err) => {
        if (err) {
            // Nếu có lỗi từ multer hoặc fileFilter
            return res.status(201).json({ warning: err.message });
        }
        // Nếu không có lỗi, tiếp tục với controller
        return await putproduct(req, res);
    });
});

// Route để xóa SP
productRouter.delete('/sanpham/:id', async (req, res) => {
    return await deleteproduct(req, res);
});

productRouter.post('/sanpham/delete', async (req, res) => {
    return await deleteproducts(req, res);
});

module.exports = productRouter;