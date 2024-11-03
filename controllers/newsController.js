const pool = require('../config/database');
const newsService = require('../services/newsService');

// Hiển thị tất cả tin tức cùng với hình ảnh
const getNews = async (req, res) => {
    try {
        const news = await newsService.getAllNews();
        res.json(news);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

// Thêm tin tức
const postNews = async (req, res) => {
    try {
        const result = await newsService.createNews(req.body);
        if (result.status === 'warning') {
            return res.status(201).json(result);
        }

        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Sửa tin tức
const updateNews = async (req, res) => {
    const { id } = req.params; 

    try {
        const result = await newsService.updateNews(id, req.body);
        
        // Kiểm tra trạng thái
        if (result.status === 'warning') {
            return res.status(201).json(result);
        } else if (result.status === 'error') {
            return res.status(404).json(result);
        }

        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Xóa tin tức
const deleteNews = async (req, res) => {
    const { id } = req.params;

    try {
        const result = await newsService.deleteNews(id);

        // Kiểm tra trạng thái
        if (result.status === 'warning') {
            return res.status(201).json(result);
        } else if (result.status === 'error') {
            return res.status(404).json(result);
        }

        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { getNews, postNews, updateNews, deleteNews };
