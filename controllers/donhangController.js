// controllers/donhangController.js

const donHangService = require('../services/donhangService');
const chiTietDonHangService = require('../services/chiTietDonHangService');

// Controller - donhangController.js
// Controller - donhangController.js
exports.createDonHang = async (req, res) => {
  try {
    const { NguoiDungId, TongTien, TrangThai, chiTietSanPhamList } = req.body;

    // Gọi service tạo đơn hàng
    const donHangResult = await donHangService.createDonHang(NguoiDungId, TongTien, TrangThai, chiTietSanPhamList);

    // Kiểm tra nếu trả về cảnh báo
    if (donHangResult.warning) {
      return res.status(201).json({
        warning: donHangResult.warning,
        donHang: null,
      });
    }

    // Nếu không có cảnh báo, trả về thông báo thành công
    return res.status(200).json({
      success: donHangResult.success,
      donHang: donHangResult.donHang,
    });

  } catch (error) {

    return res.status(201).json({ warning: 'Đã có lỗi xảy ra' });
  }
};

// Tạo chi tiết đơn hàng mới
exports.createChiTietDonHang = async (req, res) => {
  try {
    const { DonHangId, SanPhamId, ChiTietSanPhamId, SoLuong, Gia } = req.body;
    const chiTiet = await donHangService.createChiTietDonHang(DonHangId, SanPhamId, ChiTietSanPhamId, SoLuong, Gia);
    res.status(201).json({ success: true, chiTiet });
  } catch (error) {
    console.error('Error creating chi tiet don hang:', error);
    res.status(201).json({ success: false, message: 'Server error' });
  }
};

// Lấy đơn hàng theo ID
exports.getDonHangById = async (req, res) => {
  try {
    const { DonHangId } = req.params;
    const donHang = await donHangService.getDonHangById(DonHangId);
    if (!donHang) {
      return res.status(404).json({ success: false, message: 'Don hang not found' });
    }
    res.status(200).json({ success: true, donHang });
  } catch (error) {
    console.error('Error getting don hang by id:', error);
    res.status(201).json({ success: false, message: 'Server error' });
  }
};

// Lấy chi tiết đơn hàng theo DonHangId
exports.getChiTietDonHangByDonHangId = async (req, res) => {
  try {
    const { DonHangId } = req.params;
    const chiTietDonHang = await chiTietDonHangService.getChiTietDonHangByDonHangId(DonHangId);
    res.status(200).json({ success: true, chiTietDonHang });
  } catch (error) {
    console.error('Error getting chi tiet don hang by donhangid:', error);
    res.status(201).json({ success: false, message: 'Server error' });
  }
};
