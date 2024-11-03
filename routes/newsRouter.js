
const express = require('express');
const { getNews ,postNews ,updateNews , deleteNews } = require('../controllers/newsController');
const router = express.Router();


// Route để lấy danh sách tin tức
router.get('/news', getNews);

// Route để thêm tin tức
router.post('/news', postNews);

// Route để sửa tin tức
router.put('/news/:id', updateNews);

// Route để xóa tin tức
router.delete('/news/:id', deleteNews);

module.exports = router;