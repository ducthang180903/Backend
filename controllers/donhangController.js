// controllers/donhangController.js

const donHangService = require('../services/donhangService');
const chiTietDonHangService = require('../services/chiTietDonHangService');

// Controller - donhangController.js
// Controller - donhangController.js
exports.createDonHang = async (req, res) => {
  const { NguoiDungId, TongTien, TrangThai, chiTietSanPhamList } = req.body;

  try {
    const result = await donHangService.createDonHang(NguoiDungId, TongTien, TrangThai, chiTietSanPhamList);
    
    if (result.status !== 200) {
      return res.status(result.status).json({ message: result.warning });
    }
    
    return res.status(result.status).json({ message: result.success, donHang: result.donHang });
  } catch (error) {
    console.error('Error in createDonHang controller:', error);
    return res.status(500).json({ message: 'Lỗi hệ thống, vui lòng thử lại sau.' });
  }
};



// Tạo chi tiết đơn hàng mới
exports.createChiTietDonHang = async (req, res) => {
  try {
    const { DonHangId, SanPhamId, ChiTietSanPhamId, SoLuong, Gia } = req.body;
    const chiTiet = await donHangService.createChiTietDonHang(DonHangId, SanPhamId, ChiTietSanPhamId, SoLuong, Gia);
    res.status(200).json({ success: true, chiTiet });
  } catch (error) {
    console.error('Error creating chi tiet don hang:', error);
    res.status(500).json({ error: 'Server error' });
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

exports.getDonHangByall0 = async (req, res) => {
  try {
    // Gọi service để lấy tất cả đơn hàng
    const donHangs = await donHangService.getAllDonHangall0();

    // Nếu không tìm thấy đơn hàng nào
    if (donHangs.length === 0) {
      return res.status(404).json({ message: 'Không tìm thấy đơn hàng' });
    }

    // Trả về dữ liệu kết quả
    const result = donHangs.map(donHang => ({
      DonHangId: donHang.DonHangId,
      NguoiDungId: donHang.NguoiDungId, // Lấy NguoiDungId từ bảng DonHangDaDangNhap
      TongTien: donHang.TongTien, // Tổng tiền của đơn hàng
      TrangThai: donHang.TrangThai, // Trạng thái đơn hàng
      TenDangNhap: donHang.NguoiDung ? donHang.NguoiDung.TenDangNhap : null, // Lấy TenNguoiDung từ bảng NguoiDung
      DiaChi: donHang.NguoiDung ? donHang.NguoiDung.DiaChi : null, // Lấy DiaChi từ bảng NguoiDung
      SoDienThoai: donHang.NguoiDung ? donHang.NguoiDung.SoDienThoai : null, // Lấy SoDienThoai từ bảng NguoiDung



    }));

    return res.status(200).json(result); // Trả về kết quả dưới dạng JSON
  } catch (error) {
    console.error('Error in donhangController:', error);
    return res.status(500).json({ warning: 'Đã có lỗi xảy ra khi lấy đơn hàng' });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const DonHangId = req.params.DonHangId; // Lấy DonHangId từ URL
    const { TrangThai } = req.body;  // Lấy trạng thái mới từ body

    if (!DonHangId || !TrangThai) {
      return res.status(201).json({ warning: 'Thiếu DonHangId hoặc trạng thái mới' });
    }

    // Gọi service để cập nhật trạng thái đơn hàng
    const result = await donHangService.updateOrderStatus(DonHangId, TrangThai);

    if (result.status === 404) {
      return res.status(404).json(result);
    }

    return res.status(200).json(result); // Trả về mã trạng thái và kết quả từ service
  } catch (error) {
    console.error('Lỗi khi xử lý request:', error);
    return res.status(500).json({ message: 'Đã xảy ra lỗi' });
  }
};
exports.getDonHangController = async (req, res) => {
  const NguoiDungId = req.params.NguoiDungId; // Lấy NguoiDungId từ URL

  try {
    const donHangData = await donHangService.getDonHangByall(NguoiDungId); // Gọi service

    // Kiểm tra kết quả từ service và trả về phản hồi phù hợp
    if (donHangData.status === 404) {
      return res.status(404).json(donHangData);
    }

    if (donHangData.status === 500) {
      return res.status(500).json(donHangData);
    }

    // Trả về danh sách đơn hàng nếu thành công
    return res.status(200).json(donHangData);

  } catch (error) {
    console.error('Error in controller:', error);
    return res.status(500).json({ message: 'Đã có lỗi xảy ra trong controller' });
  }
};