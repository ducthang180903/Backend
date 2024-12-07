// services/donhangService.js

const DonHangDaDangNhap = require('../models/DonHangDaDangNhap');
const NguoiDung = require('../models/userModel');
const ChiTietDonHangDaDangNhap = require('../models/ChiTietDonHangDaDangNhap');
const GioHang = require('../models/cartModels');
const ChiTietGioHang = require('../models/chitietgiohangModels');
const SanPham = require('../models/productModel');
const ChiTietSanPham = require('../models/chitietsanphamModels');
const HinhAnhSanPham = require('../models/imgproductModel');
const ThanhToan = require('../models/thanhtoanModel');
const moment = require('moment-timezone');
const donhangService = require('../services/chiTietDonHangService');

exports.createDonHang = async (NguoiDungId, TongTien, TrangThai, chiTietSanPhamList) => {
  try {
    // Kiểm tra người dùng trong bảng NguoiDung
    const nguoiDung = await NguoiDung.findOne({
      where: { NguoiDungId },
    });

    if (!nguoiDung) {
      return { warning: 'Người dùng không tồn tại', status: 201 };
    }

    // Kiểm tra nếu người dùng chưa cung cấp đầy đủ thông tin (Địa chỉ và Số điện thoại)
    if (!nguoiDung.DiaChi || !nguoiDung.SoDienThoai) {
      return { warning: 'Người dùng chưa cung cấp đầy đủ thông tin (Địa chỉ và Số điện thoại)', status: 201 };
    }

    // Kiểm tra số lượng sản phẩm cho mỗi sản phẩm trong chiTietSanPhamList
    for (const chiTiet of chiTietSanPhamList) {
      const chiTietSanPham = await ChiTietSanPham.findOne({
        where: { ChiTietSanPhamId: chiTiet.ChiTietSanPhamId },
      });

      // Nếu không tìm thấy sản phẩm hoặc số lượng không đủ
  

      if (chiTietSanPham.SoLuong < chiTiet.SoLuong) {
        return { warning: `Không đủ số lượng sản phẩm:Số lượng còn lại: ${chiTietSanPham.SoLuong}`, status: 201 };
      }
    }

    // Tạo đơn hàng
    const donHang = await DonHangDaDangNhap.create({
      NguoiDungId,
      TongTien,
      TrangThai,
    });

    // Tạo chi tiết đơn hàng cho từng sản phẩm
    for (const chiTiet of chiTietSanPhamList) {
      await donhangService.createChiTietDonHang(donHang.DonHangId, chiTiet.SanPhamId, chiTiet.ChiTietSanPhamId, chiTiet.SoLuong, chiTiet.Gia);
      
      // Cập nhật số lượng sản phẩm sau khi thêm vào đơn hàng
      const chiTietSanPham = await ChiTietSanPham.findOne({
        where: { ChiTietSanPhamId: chiTiet.ChiTietSanPhamId },
      });
      await ChiTietSanPham.update(
        { SoLuong: chiTietSanPham.SoLuong - chiTiet.SoLuong },
        { where: { ChiTietSanPhamId: chiTiet.ChiTietSanPhamId } }
      );
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

    return {
      success: 'Thanh Toán thành công!',
      donHang,
      status: 200,
    };

  } catch (error) {
    console.error('Error creating don hang in service:', error);
    return { warning: error.message, status: 201 };
  }
};


exports.getDonHangByall = async (NguoiDungId) => {
  try {
    if (!NguoiDungId) {
      throw new Error("NguoiDungId is required");
    }

    // Lấy tất cả đơn hàng của người dùng
    const donHangs = await DonHangDaDangNhap.findAll({
      where: { NguoiDungId },
      include: [
        {
          model: ChiTietDonHangDaDangNhap,
          required: true,
          include: [
            {
              model: SanPham,
              attributes: ['TenSanPham'], // Chỉ lấy tên sản phẩm
              include: [
                {
                  model: HinhAnhSanPham, // Lấy hình ảnh sản phẩm
                  attributes: ['DuongDanHinh'], // Đảm bảo tên trường khớp với database
                },
              ],
            },
            {
              model: ChiTietSanPham,
              attributes: ['LoaiChiTiet', 'Gia'],
            },
          ],
        },
      ],
    });

    if (donHangs.length === 0) {
      return { message: 'Không tìm thấy đơn hàng', status: 404 };
    }

    // Chuẩn hóa dữ liệu trả về
    const result = donHangs.map(donHang => ({
      DonHangId: donHang.id, // ID của đơn hàng
      TongTien: donHang.TongTien, // Tổng tiền của đơn hàng
      TrangThai: donHang.TrangThai, // Trạng thái đơn hàng
      SanPham: donHang.ChiTietDonHangDaDangNhaps.map(detail => ({
        TenSanPham: detail.SanPham.TenSanPham,
        LoaiChiTiet: detail.ChiTietSanPham?.LoaiChiTiet || null,
        Gia: detail.ChiTietSanPham?.Gia || null,
        SoLuong: detail.SoLuong,
        DuongDanHinh: detail.SanPham.HinhAnhSanPhams.map(hinhAnh => hinhAnh.DuongDanHinh),
      })),
    }));

    return result;

  } catch (error) {
    console.error('Error getting don hang by all:', error);
    return { warning: 'Đã có lỗi xảy ra khi lấy đơn hàng', status: 500 };
  }
};

exports.getAllDonHangall0 = async () => {
  try {
    // Lấy tất cả thông tin từ bảng DonHangDaDangNhap kèm theo thông tin người dùng từ bảng NguoiDung
    const donHangs = await DonHangDaDangNhap.findAll({
      attributes: ['DonHangId', 'NguoiDungId', 'TongTien', 'TrangThai'], // Các trường cần thiết từ bảng DonHangDaDangNhap
      include: [
        {
          model: NguoiDung, // Liên kết với bảng NguoiDung
          required: false,
          attributes: ['TenDangNhap', 'DiaChi', 'SoDienThoai'], // Lấy các trường từ bảng NguoiDung
        },
        {
          model: ChiTietDonHangDaDangNhap,
          required: true,
          include: [
            {
              model: SanPham,
              attributes: ['TenSanPham'], // Chỉ lấy tên sản phẩm
              include: [
                {
                  model: HinhAnhSanPham, // Lấy hình ảnh sản phẩm
                  attributes: ['DuongDanHinh'], // Đảm bảo tên trường khớp với trong database
                },
              ],
            },
            {
              model: ChiTietSanPham,
              attributes: ['LoaiChiTiet', 'Gia'], // Lấy loại chi tiết và giá
            },
          ],
        },
      ],
    });

    return donHangs; // Trả về kết quả tìm được
  } catch (error) {
    console.error('Error:', error.message); // Log lỗi chi tiết
    throw new Error('Đã có lỗi xảy ra khi lấy đơn hàng');
  }
};

exports.getDonHangById = async (DonHangId) => {
  try {
    if (!DonHangId) {
      throw new Error("DonHangId is required");
    }

    // Lấy thông tin đơn hàng theo DonHangId
    const donHang = await DonHangDaDangNhap.findOne({
      where: { DonHangId },
      include: [
        {
          model: ChiTietDonHangDaDangNhap,
          required: true,
          include: [
            {
              model: SanPham,
              attributes: ['TenSanPham'], // Chỉ lấy tên sản phẩm
              include: [
                {
                  model: HinhAnhSanPham, // Lấy hình ảnh sản phẩm
                  attributes: ['DuongDanHinh'], // Đảm bảo tên trường khớp với trong database
                },
              ],
            },
            {
              model: ChiTietSanPham,
              attributes: ['LoaiChiTiet', 'Gia'], // Lấy loại chi tiết và giá
            },
          ],
        },

      ],
    });
    const ThoiGiaTao = moment(donHang.ThoiGianTao).tz('Asia/Ho_Chi_Minh').format('HH:mm:ss DD-MM-YYYY');
    // return ThoiGiaTao;
    if (!donHang) {
      return { message: 'Không tìm thấy đơn hàng', status: 404 };
    }

    // Lấy thông tin người dùng của đơn hàng (địa chỉ và số điện thoại) nếu có
    const user = await NguoiDung.findOne({
      where: { NguoiDungId: donHang.NguoiDungId },
      attributes: ['TenDangNhap', 'DiaChi', 'SoDienThoai'],
    });

    if (!user) {
      return { message: 'Không tìm thấy thông tin người dùng', status: 404 };
    }

    const pay = await ThanhToan.findOne({
      where: { DonHangId: donHang.DonHangId },
      attributes: ['PhuongThuc', 'TrangThaiThanhToan',],
    });

    if (!pay) {
      return { message: 'Không tìm thấy thông tin Thanh Toán', status: 404 };
    }
    // Tạo mảng sản phẩm với đầy đủ thông tin
    const result = donHang.ChiTietDonHangDaDangNhaps.map(detail => ({
      TenSanPham: detail.SanPham.TenSanPham,
      LoaiChiTiet: detail.ChiTietSanPham.LoaiChiTiet,
      Gia: detail.ChiTietSanPham.Gia,
      SoLuong: detail.SoLuong,
      HinhAnhSanPham: detail.SanPham.HinhAnhSanPhams.map(img => img.DuongDanHinh),
    }));

    // Thêm thông tin người dùng và tổng tiền vào kết quả trả về
    result.push({
      TenDangNhap: user.TenDangNhap,
      DiaChi: user.DiaChi,
      SoDienThoai: user.SoDienThoai,
      TongTien: donHang.TongTien,
      TrangThai: donHang.TrangThai,
      ThoiGiaTao: ThoiGiaTao
    });
    result.push({
      PhuongThuc: pay.PhuongThuc,
      TrangThaiThanhToan: pay.TrangThaiThanhToan,

    });

    return result;

  } catch (error) {
    console.error('Error getting don hang by DonHangId in service:', error);
    return { warning: 'Đã có lỗi xảy ra khi lấy đơn hàng', status: 500 };
  }
};

exports.updateOrderStatus = async (DonHangId, TrangThai) => {
  try {
    // Kiểm tra nếu DonHangId và TrangThai hợp lệ
    if (!DonHangId || !TrangThai) {
      // Nếu thiếu DonHangId hoặc TrangThai, trả về lỗi với mã 201 (Created)
      return {
        message: 'Thiếu DonHangId hoặc trạng thái mới',
        status: 201
      };
    }

    // Cập nhật trạng thái đơn hàng
    const updatedOrder = await DonHangDaDangNhap.update(
      { TrangThai: TrangThai },
      { where: { DonHangId }, returning: true }
    );

    // Nếu không có đơn hàng nào được cập nhật
    if (updatedOrder[0] === 0) {
      return {
        message: 'Không tìm thấy đơn hàng hoặc trạng thái không thay đổi',
        status: 404
      };
    }

    // Trả về kết quả cập nhật thành công với mã 200 (OK)
    return {
      message: 'Cập nhật trạng thái thành công',
      order: updatedOrder[1][0],
    };
  } catch (error) {
    console.error('Lỗi khi cập nhật trạng thái đơn hàng:', error);
    // Trả về lỗi với mã 500 (Internal Server Error) nếu có lỗi xảy ra
    return {
      message: 'Đã xảy ra lỗi',
      status: 500
    };
  }
};