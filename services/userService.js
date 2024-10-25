const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const { Op } = require('sequelize');


//đăng ký tài khoản người dùng
const register = async (userData) => {
    const { TenDangNhap, MatKhau, Email, DiaChi, SoDienThoai } = userData;

    // Kiểm tra tên đăng nhập và email đã tồn tại chưa
    const existingUser = await User.findOne({
        where: {
            [Op.or]: [
                { TenDangNhap },
                { Email }
            ]
        }
    });

    if (existingUser) {
        throw new Error('Tên đăng nhập hoặc email đã tồn tại.');
    }

    // Mã hóa mật khẩu
    const hashedPassword = await bcrypt.hash(MatKhau, 10); // 10 là số rounds mã hóa

    // Tạo người dùng mới
    const newUser = await User.create({
        TenDangNhap,
        MatKhau: hashedPassword,
        Email,
        DiaChi,
        SoDienThoai
    });

    return newUser;
};


// Đăng nhập tài khoản người dùng
const login = async (userData) => {
    const { TenDangNhap, MatKhau } = userData;
  
    // Tìm người dùng dựa trên TenDangNhap hoặc Email
    const user = await User.findOne({
      where: {
        [Op.or]: [
          { TenDangNhap: TenDangNhap },
          { Email: TenDangNhap }
        ]
      }
    });
  
    if (!user) throw new Error('Tên đăng nhập hoặc email không tồn tại');
  
    // So sánh mật khẩu nhập vào với mật khẩu đã băm nhỏ
    const isMatch = await bcrypt.compare(MatKhau, user.MatKhau);
  
    if (!isMatch) throw new Error('Mật khẩu không chính xác');
  
    return user; // Trả về thông tin người dùng nếu đăng nhập thành công
  };
  
   // Lấy tất cả người dùng từ model User
  const getAllUsers = async () => {
    const users = await User.findAll({
        attributes: ['NguoiDungId', 'TenDangNhap', 'Email', 'DiaChi', 'SoDienThoai'] // Lấy các trường cần thiết
    });
    return users;
};

// Hàm xóa người dùng
const deleteUser = async (nguoiDungId) => {
    // Tìm người dùng bằng NguoiDungId
    const user = await User.findOne({
        where: {
            NguoiDungId: nguoiDungId
        }
    });

    if (!user) {
        throw new Error('Người dùng không tồn tại.'); // Nếu không tìm thấy người dùng
    }

    // Xóa người dùng
    await User.destroy({
        where: {
            NguoiDungId: nguoiDungId
        }
    });

    return user; // Có thể trả về người dùng đã xóa, hoặc một thông điệp khác nếu cần
};
// Hàm cập nhật thông tin người dùng
const updateUser = async (nguoiDungId, userData) => {
    const { TenDangNhap, MatKhau, Email, DiaChi, SoDienThoai } = userData;

    // Tìm người dùng bằng NguoiDungId
    const user = await User.findOne({
        where: { NguoiDungId: nguoiDungId }
    });

    if (!user) {
        throw new Error('Người dùng không tồn tại.'); // Nếu không tìm thấy người dùng
    }

    // Kiểm tra xem tên đăng nhập hoặc email đã tồn tại trong cơ sở dữ liệu không
    const existingUser = await User.findOne({
        where: {
            [Op.or]: [
                { TenDangNhap, Email },
                // Kiểm tra trừ chính người dùng đang cập nhật
                {
                    [Op.and]: [
                        { NguoiDungId: { [Op.ne]: nguoiDungId } },
                        { TenDangNhap }
                    ]
                },
                {
                    [Op.and]: [
                        { NguoiDungId: { [Op.ne]: nguoiDungId } },
                        { Email }
                    ]
                }
            ]
        }
    });

    if (existingUser) {
        throw new Error('Tên đăng nhập hoặc email đã tồn tại.'); // Nếu trùng lặp
    }

    // Mã hóa mật khẩu nếu có thay đổi mật khẩu
    const hashedPassword = MatKhau ? await bcrypt.hash(MatKhau, 10) : user.MatKhau;

    // Cập nhật thông tin người dùng
    await user.update({
        TenDangNhap,
        MatKhau: hashedPassword,
        Email,
        DiaChi,
        SoDienThoai
    });

    return user; // Trả về người dùng đã được cập nhật
};



module.exports = { register, login ,getAllUsers , deleteUser , updateUser };
