// services/chiTietDonHangService.js

const ChiTietDonHangDaDangNhap = require('../models/ChiTietDonHangDaDangNhap');

exports.createChiTietDonHang = async (DonHangId, SanPhamId, ChiTietSanPhamId, SoLuong, Gia) => {
  try {
    const chiTiet = await ChiTietDonHangDaDangNhap.create({
      DonHangId,
      SanPhamId,
      ChiTietSanPhamId,
      SoLuong,
      Gia,
    });
    return chiTiet;
  } catch (error) {
    console.error('Error creating chi tiet don hang in service:', error);
    throw error;
  }
};

exports.getChiTietDonHangByDonHangId = async (DonHangId) => {
  try {
    const chiTietDonHang = await ChiTietDonHangDaDangNhap.findAll({
      where: { DonHangId },
    });
    return chiTietDonHang;
  } catch (error) {
    console.error('Error getting chi tiet don hang by donhangid in service:', error);
    throw error;
  }
};
