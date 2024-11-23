// controllers/ThanhToanController.js
const ThanhToanService = require('../services/ThanhToanService'); // Import service xử lý thanh toán

// Lấy tất cả các bản ghi thanh toán
const getAllThanhToans = async (req, res) => {
    try {
        const thanhToans = await ThanhToanService.getAllThanhToans(); // Gọi service để lấy danh sách thanh toán
        res.status(200).json(thanhToans); // Trả về kết quả với mã trạng thái 200 (OK)
    } catch (error) {
        res.status(500).json({ message: error.message }); // Trả về lỗi nếu có
    }
};

// Lấy thanh toán theo ThanhToanId
const getThanhToanById = async (req, res) => {
    const { ThanhToanId } = req.params; // Lấy ThanhToanId từ tham số URL
    try {
        const thanhToan = await ThanhToanService.getThanhToanById(ThanhToanId); // Gọi service để lấy thanh toán theo ID
        res.status(200).json(thanhToan); // Trả về thanh toán nếu tìm thấy
    } catch (error) {
        res.status(404).json({ message: error.message }); // Trả về lỗi nếu không tìm thấy thanh toán
    }
};

// Tạo mới một bản ghi thanh toán
const createThanhToan = async (req, res) => {
    const { DonHangId, PhuongThuc, TrangThaiThanhToan, ThoiGianTao } = req.body; // Lấy dữ liệu từ body của request
    const data = { DonHangId, PhuongThuc, TrangThaiThanhToan, ThoiGianTao }; // Định dạng lại dữ liệu trước khi gửi vào service
    // return res.json({ data })
    try {
        const newThanhToan = await ThanhToanService.createThanhToan(data); // Gọi service để tạo mới thanh toán
        res.status(200).json(newThanhToan); // Trả về thanh toán mới tạo với mã trạng thái 201 (Created)
    } catch (error) {
        res.status(500).json({ message: error.message }); // Trả về lỗi nếu không thể tạo thanh toán
    }
};

// Cập nhật thông tin thanh toán
const updateThanhToan = async (req, res) => {
    const { ThanhToanId } = req.params; // Lấy ThanhToanId từ tham số URL
    const { DonHangId, PhuongThuc, TrangThaiThanhToan, ThoiGianTao } = req.body; // Lấy dữ liệu từ body
    const data = { DonHangId, PhuongThuc, TrangThaiThanhToan, ThoiGianTao }; // Định dạng lại dữ liệu trước khi gửi vào service
    try {
        const updatedThanhToan = await ThanhToanService.updateThanhToan(ThanhToanId, data); // Gọi service để cập nhật thanh toán
        res.status(200).json(updatedThanhToan); // Trả về thanh toán đã được cập nhật
    } catch (error) {
        res.status(404).json({ message: error.message }); // Trả về lỗi nếu không tìm thấy thanh toán để cập nhật
    }
};

module.exports = {
    getAllThanhToans,
    getThanhToanById,
    createThanhToan,
    updateThanhToan,
};