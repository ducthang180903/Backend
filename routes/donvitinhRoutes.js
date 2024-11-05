const express = require('express');
const { getproducttype , postproducttype , putproducttype ,deleteproducttype } = require('../controllers/donvitinhController');
const router = express.Router();

// Route để lấy danh sách loaisp
router.get('/DVT', getproducttype);

// Route dể thêm loaisp
router.post('/DVT', postproducttype);

// Route SỬ loaisp
router.put('/DVT/:id', putproducttype);

// Route xóa loaisp
router.delete('/DVT/:id', deleteproducttype);

module.exports = router;