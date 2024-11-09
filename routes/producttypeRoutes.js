const express = require('express');
const productTypeRouter = express.Router();
const { getproducttype, postproducttype, putproducttype, deleteproducttype, deleteproducttypes } = require('../controllers/producttypeController');

// Route để lấy danh sách loại sản phẩm
productTypeRouter.get('/loaisp', async (req, res) => {
    return await getproducttype(req, res);
});

// Route để thêm loại sản phẩm
productTypeRouter.post('/loaisp', async (req, res) => {
    return await postproducttype(req, res);
});

// Route để sửa loại sản phẩm
productTypeRouter.put('/loaisp/:id', async (req, res) => {
    return await putproducttype(req, res);
});

// Route để xóa loại sản phẩm
productTypeRouter.delete('/loaisp/:id', async (req, res) => {
    return await deleteproducttype(req, res);
});

productTypeRouter.post('/delete', async (req, res) => {
    return await deleteproducttypes(req, res);
});

module.exports = productTypeRouter;