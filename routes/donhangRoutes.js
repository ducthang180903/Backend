// routes/donhangRoutes.js

const express = require('express');
const DonHang = express.Router();
const donhangController = require('../controllers/donhangController');

// Tạo đơn hàng mới
// router.post('/donhang', donhangController.createDonHang);
DonHang.post('/donhang', async (req, res) => {
    return await donhangController.createDonHang(req, res);
});
// Tạo chi tiết đơn hàng mới
// router.post('/chitietdonhang', donhangController.createChiTietDonHang);
DonHang.post('/chitietdonhang', async (req, res) => {
    return await donhangController.createChiTietDonHang(req, res);
});
// Lấy đơn hàng theo ID
// router.get('/donhang/:DonHangId', donhangController.getDonHangById);
DonHang.get('/donhang/:DonHangId', async (req, res) => {
    return await donhangController.getDonHangById(req, res);
});
// Lấy chi tiết đơn hàng theo DonHangId
// router.get('/chitietdonhang/:DonHangId', donhangController.getChiTietDonHangByDonHangId);
DonHang.get('/chitietdonhang/:DonHangId', async (req, res) => {
    return await donhangController.getChiTietDonHangByDonHangId(req, res);
});
module.exports = DonHang;
