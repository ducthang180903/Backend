// routes/chitietsanphamRoutes.js
const express = require('express');
const ChiTietSanPham = express.Router();
const { fetchChiTietSanPham , showAllChiTietSanPham  , addChiTietSanPham, updateChiTietSanPham, deleteChiTietSanPham} = require('../controllers/chitietsanphamController');

const router = express.Router();

// Route để lấy chi tiết sản phẩm
// router.get('/chitietsp/:id', fetchChiTietSanPham);
ChiTietSanPham.get('/chitietsp/:id', async (req, res) => {
    return await fetchChiTietSanPham(req, res);
});

// router.get('/chitietsp', showAllChiTietSanPham);
ChiTietSanPham.get('/chitietsp', async (req, res) => {
    return await showAllChiTietSanPham(req, res);
});
// router.post('/chitietsanpham',addChiTietSanPham);
ChiTietSanPham.post('/chitietsanpham', async (req, res) => {
    return await addChiTietSanPham(req, res);
});
// router.put('/chitietsanpham/:id',updateChiTietSanPham);
ChiTietSanPham.put('/chitietsanpham/:id', async (req, res) => {
    return await updateChiTietSanPham(req, res);
});
// router.delete('/chitietsanpham/:id',deleteChiTietSanPham);
ChiTietSanPham.delete('/chitietsanpham/:id', async (req, res) => {
    return await deleteChiTietSanPham(req, res);
});
module.exports = ChiTietSanPham;
