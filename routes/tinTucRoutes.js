const express = require('express');
const tinTucRouter = express.Router();
const {
    getAllTinTuc,
    getTinTucById,
    createTinTuc,
    updateTinTuc,
    deleteTinTuc,
    deleteMultipleTinTuc,
    searchTinTuc,
} = require('../controllers/tinTucController');
const upload = require('../config/multerConfig');

// Lấy danh sách tất cả tin tức
tinTucRouter.get('/tintuc', async (req, res) => {
    return await getAllTinTuc(req, res);
});

// Lấy thông tin một tin tức theo ID
tinTucRouter.get('/tintuc/:id', async (req, res) => {
    return await getTinTucById(req, res);
});

// Tìm kiếm tin tức
tinTucRouter.get('/search', async (req, res) => {
    return await searchTinTuc(req, res);
});

// Thêm tin tức mới
tinTucRouter.post('/tintuc', (req, res) => {
    upload(req, res, async (err) => {
        if (err) {
            // Nếu có lỗi từ multer hoặc fileFilter
            return res.status(201).json({ warning: err.message });
        }
        // Nếu không có lỗi, tiếp tục với controller
        return await createTinTuc(req, res);
    });
});

tinTucRouter.put('/tintuc/:id', (req, res) => {
    upload(req, res, async (err) => {
        if (err) {
            return res.status(201).json({ warning: err.message });
        }
        return await updateTinTuc(req, res);
    });
});

// Xóa tin tức theo ID
tinTucRouter.delete('/tintuc/:id', async (req, res) => {
    return await deleteTinTuc(req, res);
});

// Xóa nhiều tin tức
tinTucRouter.post('/tintuc/delete', async (req, res) => {
    return await deleteMultipleTinTuc(req, res);
});

module.exports = tinTucRouter;
