// services/donhangService.js

const DonHangDaDangNhap = require('../models/DonHangDaDangNhap');
const NguoiDung = require('../models/userModel');
const ChiTietDonHangDaDangNhap = require('../models/ChiTietDonHangDaDangNhap');
const GioHang = require('../models/cartModels');
const ChiTietGioHang = require('../models/chitietgiohangModels');

exports.createDonHang = async (NguoiDungId, TongTien, TrangThai, chiTietSanPhamList) => {
  try {
    // Kiểm tra người dùng trong bảng NguoiDung
    const nguoiDung = await NguoiDung.findOne({
      where: { NguoiDungId },
    });

    // Kiểm tra nếu người dùng không tồn tại
    if (!nguoiDung) {
      return { warning: 'Người dùng không tồn tại', status: 201 };
    }

    // Kiểm tra nếu người dùng chưa cung cấp đầy đủ thông tin (Địa chỉ và Số điện thoại)
    if (!nguoiDung.DiaChi || !nguoiDung.SoDienThoai) {
      return { warning: 'Người dùng chưa cung cấp đầy đủ thông tin (Địa chỉ và Số điện thoại)', status: 201 };
    }

    // Tạo đơn hàng
    const donHang = await DonHangDaDangNhap.create({
      NguoiDungId,
      TongTien,
      // Có thể thêm trạng thái đơn hàng ở đây nếu cần
    });

    // Tạo chi tiết đơn hàng cho từng sản phẩm
    for (const chiTiet of chiTietSanPhamList) {
      await ChiTietDonHangDaDangNhap.create({
        DonHangId: donHang.DonHangId,
        SanPhamId: chiTiet.SanPhamId,
        ChiTietSanPhamId: chiTiet.ChiTietSanPhamId,
        SoLuong: chiTiet.SoLuong,
        Gia: chiTiet.Gia,
      });
    }

    // Xóa sản phẩm khỏi giỏ hàng sau khi tạo đơn hàng thành công
    const existingCart = await GioHang.findOne({ where: { NguoiDungId } });
    if (existingCart) {
      for (const chiTiet of chiTietSanPhamList) {
        await ChiTietGioHang.destroy({
          where: {
            GioHangId: existingCart.GioHangId,
            SanPhamId: chiTiet.SanPhamId,
            ChiTietSanPhamId: chiTiet.ChiTietSanPhamId,
          }
        });
      }
    }

    // Trả về thông báo thành công và thông tin đơn hàng
    return {
      message: 'Thanh Toán thành công!',
      donHang,
      status: 200,
    };

  } catch (error) {
    // Xử lý lỗi nếu có
    console.error('Error creating don hang in service:', error);
    return { warning: error.message, status: 201 };
  }
};

exports.getDonHangById = async (DonHangId) => {
  try {
    const donHang = await DonHangDaDangNhap.findOne({
      where: { DonHangId },
      include: [
        {
          model: ChiTietDonHangDaDangNhap,
          required: true,  // Nếu bạn muốn chỉ lấy đơn hàng có chi tiết (JOIN)
        },
      ],
    });
    return donHang;
  } catch (error) {
    console.error('Error getting don hang by id in service:', error);
    return { warning: 'Đã có lỗi xảy ra khi lay đơn hàng', status: 201 };
  }
};

