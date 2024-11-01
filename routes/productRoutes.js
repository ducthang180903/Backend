const express = require('express');
const productRouter = express.Router();
const { getproduct, postproduct, putproduct, deleteproduct, deleteproducts } = require('../controllers/productController');
const upload = require('../config/multerConfig');

productRouter.get('/', async (req, res) => {
    return await getproduct(req, res);
});

// Route để thêm SP
productRouter.post('/', (req, res) => {
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
productRouter.put('/:id', async (req, res) => {
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
productRouter.delete('/:id', async (req, res) => {
    return await deleteproduct(req, res);
});

productRouter.post('/delete', async (req, res) => {
    return await deleteproducts(req, res);
});

module.exports = productRouter;