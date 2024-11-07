// routes/chitietsanphamRoutes.js
const express = require('express');
const { fetchChiTietSanPham , showAllChiTietSanPham  , addChiTietSanPham, updateChiTietSanPham, deleteChiTietSanPham} = require('../controllers/chitietsanphamController');

const router = express.Router();

// Route để lấy chi tiết sản phẩm
router.get('/chitietsp/:id', fetchChiTietSanPham);
router.get('/chitietsp', showAllChiTietSanPham);
router.post('/chitietsanpham',addChiTietSanPham);
router.put('/chitietsanpham/:id',updateChiTietSanPham);
router.delete('/chitietsanpham/:id',deleteChiTietSanPham);
module.exports = router;
