const express = require('express');
const { getproducttype , postproducttype , putproducttype ,deleteproducttype } = require('../controllers/producttypeController');
const router = express.Router();

// Route để lấy danh sách loaisp
router.get('/loaisp', getproducttype);

// Route dể thêm loaisp
router.post('/loaisp', postproducttype);

// Route SỬ loaisp
router.put('/loaisp/:id', putproducttype);

// Route xóa loaisp
router.delete('/loaisp/:id', deleteproducttype);

module.exports = router;