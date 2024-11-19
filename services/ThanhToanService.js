// services/ThanhToanService.js
const  ThanhToan  = require('../models/thanhtoanModel'); // Import model ThanhToan

// Lấy tất cả các bản ghi thanh toán
const getAllThanhToans = async () => {
  try {
    const thanhToans = await ThanhToan.findAll(); // Lấy tất cả các bản ghi trong bảng ThanhToan
    return thanhToans; // Trả về danh sách thanh toán
  } catch (error) {
    throw new Error('Không thể lấy dữ liệu thanh toán: ' + error.message); // Xử lý lỗi nếu có
  }
};

// Lấy một bản ghi thanh toán theo ThanhToanId
const getThanhToanById = async (ThanhToanId) => {
  try {
    const thanhToan = await ThanhToan.findByPk(ThanhToanId); // Lấy thanh toán theo khóa chính (ThanhToanId)
    if (!thanhToan) {
      throw new Error('Không tìm thấy thanh toán với ID này');
    }
    return thanhToan; // Trả về thông tin thanh toán tìm được
  } catch (error) {
    throw new Error('Không thể lấy thanh toán: ' + error.message); // Xử lý lỗi nếu không tìm thấy
  }
};

// Tạo mới một bản ghi thanh toán
const createThanhToan = async (data) => {
  try {
    const newThanhToan = await ThanhToan.create(data); // Tạo mới bản ghi thanh toán với dữ liệu truyền vào
    return newThanhToan; // Trả về thanh toán mới tạo
  } catch (error) {
    throw new Error('Không thể tạo thanh toán: ' + error.message); // Xử lý lỗi nếu không thể tạo mới
  }
};

// Cập nhật thông tin thanh toán
const updateThanhToan = async (ThanhToanId, data) => {
  try {
    const thanhToan = await ThanhToan.findByPk(ThanhToanId); // Lấy thanh toán theo ThanhToanId
    if (!thanhToan) {
      throw new Error('Không tìm thấy thanh toán để cập nhật');
    }
    await thanhToan.update(data); // Cập nhật bản ghi thanh toán
    return thanhToan; // Trả về thanh toán đã được cập nhật
  } catch (error) {
    throw new Error('Không thể cập nhật thanh toán: ' + error.message); // Xử lý lỗi nếu có
  }
};

module.exports = {
  getAllThanhToans,
  getThanhToanById,
  createThanhToan,
  updateThanhToan,
};
