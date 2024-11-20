// routes/ThanhToanRoutes.js
const express = require('express');
const ThanhToan = express.Router();
const ThanhToanController = require('../controllers/ThanhToanController'); // Import controller xử lý thanh toán

// GET tất cả các bản ghi thanh toán
// router.get('/thanh-toans', ThanhToanController.getAllThanhToans);
ThanhToan.get('/thanh-toan', async (req, res) => {
    return await ThanhToanController.getAllThanhToans(req, res);
});
// GET thanh toán theo ThanhToanId
// router.get('/thanh-toans/:ThanhToanId', ThanhToanController.getThanhToanById);
ThanhToan.get('/thanh-toan/:ThanhToanId', async (req, res) => {
    return await ThanhToanController.getThanhToanById(req, res);
})
// POST tạo mới một bản ghi thanh toán
// router.post('/thanh-toans', ThanhToanController.createThanhToan);
ThanhToan.post('/thanh-toan', async (req, res) => {
    return await ThanhToanController.createThanhToan(req, res);
})
// PUT cập nhật thanh toán theo ThanhToanId
// router.put('/thanh-toans/:ThanhToanId', ThanhToanController.updateThanhToan);
ThanhToan.put('/thanh-toan/:ThanhToanId', async (req, res) => {
    return await ThanhToanController.updateThanhToan(req, res);
})
module.exports = ThanhToan;