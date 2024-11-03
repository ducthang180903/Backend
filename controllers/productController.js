const pool = require('../config/database');
const newsService = require('../services/newsService');

// Hiển thị tất cả tin tức cùng với hình ảnh
const getNews = async (req, res) => {
    try {
        const news = await newsService.getAllNews(); // Sử dụng hàm từ service
        res.json(news);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

// Thêm tin tức (cùng với hình ảnh)
const postNews = async (req, res) => {
    try {
        const result = await newsService.createNews(req.body); // Gọi hàm từ newsService
        if (result.status === 'warning') {
            return res.status(201).json(result);
        }

        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Sửa tin tức
const putNews = async (req, res) => {
    const { id } = req.params; // Lấy id từ params

    try {
        const result = await newsService.updateNews(id, req.body); // Gọi hàm service để cập nhật tin tức
        
        // Kiểm tra trạng thái kết quả và trả về mã trạng thái tương ứng
        if (result.status === 'warning') {
            return res.status(201).json(result);
        } else if (result.status === 'error') {
            return res.status(404).json(result);
        }

        res.status(200).json(result); // Trả về phản hồi thành công
    } catch (error) {
        res.status(500).json({ error: error.message }); // Xử lý lỗi
    }
};

// Xóa tin tức
const deleteNews = async (req, res) => {
    const { id } = req.params;

    try {
        const result = await newsService.deleteNews(id); // Gọi hàm service để xóa tin tức

        // Kiểm tra trạng thái kết quả và trả về mã trạng thái tương ứng
        if (result.status === 'warning') {
            return res.status(201).json(result);
        } else if (result.status === 'error') {
            return res.status(404).json(result);
        }

        res.status(200).json(result); // Trả về phản hồi thành công
    } catch (error) {
        res.status(500).json({ error: error.message }); // Xử lý lỗi
    }
};

module.exports = { getNews, postNews, putNews, deleteNews }; // Xuất các hàm đã sửa đổi
