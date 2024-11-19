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
DonHang.get('/donhang/:NguoiDungId', async (req, res) => {
    return await donhangController.getDonHangController(req, res);
});
// Lấy đơn hàng theo ID
// router.get('/donhang/:DonHangId', donhangController.getDonHangById);
DonHang.get('/quanly/donhang/:DonHangId', async (req, res) => {
    return await donhangController.getDonHangById(req, res);
});
// Lấy chi tiết đơn hàng theo DonHangId
// router.get('/chitietdonhang/:DonHangId', donhangController.getChiTietDonHangByDonHangId);
DonHang.get('/chitietdonhang/:DonHangId', async (req, res) => {
    return await donhangController.getChiTietDonHangByDonHangId(req, res);
});
DonHang.get('/donhangall', async (req, res) => {
    return await donhangController.getDonHangByall0(req, res);
});
DonHang.put('/donhang/:DonHangId', async (req, res) => {
    return await donhangController.updateOrderStatus(req, res);
});


module.exports = DonHang;
