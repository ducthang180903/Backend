const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const { Op } = require('sequelize');
const jwt = require('jsonwebtoken');


//đăng ký tài khoản người dùng
const register = async (userData) => {
    const { TenDangNhap, MatKhau, Account, DiaChi, SoDienThoai, VaiTro } = userData;
    const role = VaiTro || 'user';

    // Kiểm tra tên đăng nhập và email đã tồn tại chưa
    const existingUser = await User.findOne({
        where: {
            [Op.or]: [
                { TenDangNhap },
                { Account }
            ]
        }
    });

    if (existingUser) {
        return { warning: 'Tên đăng nhập hoặc tài khoản đã tồn tại.', status: 201 };
    }

    // Mã hóa mật khẩu
    const hashedPassword = await bcrypt.hash(MatKhau, 10); // 10 là số rounds mã hóa

    // Tạo người dùng mới
    const newUser = await User.create({
        TenDangNhap,
        MatKhau: hashedPassword,
        Account,
        DiaChi,
        SoDienThoai,
        VaiTro: role
    });
    if (newUser) {
        return { message: 'Người dùng đã được tạo thành công!', status: 201, newUser };
    }
};
// Đăng nhập tài khoản người dùng
const login = async (userData, req) => {
    const { Account, MatKhau } = userData;

    if (!Account || !MatKhau) {
        throw new Error('Tên đăng nhập và mật khẩu không được để trống.');
    }
    try {
        const user = await User.findOne({ where: { Account } });

        if (!user) {
            throw new Error('Tài khoản này không tồn tại.');
        }

        const isMatch = await bcrypt.compare(MatKhau, user.MatKhau);
        if (!isMatch) {
            throw new Error('Tài khoản hoặc mật khẩu không chính xác.');
        }

        // Lưu thông tin người dùng vào session nếu session tồn tại
        if (req && req.session) {
            req.session.user = {
                NguoiDungId: user.NguoiDungId,
                TenDangNhap: user.TenDangNhap,
                Email: user.Email,
                DiaChi: user.DiaChi,
                SoDienThoai: user.SoDienThoai,
                VaiTro: user.VaiTro,
                ThoiGianTao: user.ThoiGianTao
            };
            console.log('Đăng nhập thành công.');

        }
        return req.session.user;
    } catch (error) {
        return req.status(500).json({ error: error.message });
    }

};
const checkLoginStatus = (req) => {
    if (req && req.session && req.session.user) {
        // Lấy token từ session hoặc header
        const token = req.cookies.ss_account;
        if (!token) return { loggedIn: false };

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            return {
                loggedIn: true,
                user: {
                    NguoiDungId: decoded.id, // Lấy NguoiDungId từ token
                    Account: decoded.Account, // Lấy tài khoản từ token
                    MatKhau: decoded.MatKhau, // Nếu cần thiết
                },
            };
        } catch (err) {
            return {
                loggedIn: false,
            };
        }
    }
    return {
        loggedIn: false,
    };
};
// Lấy tất cả người dùng từ model User
const getAllUsers = async () => {
    const users = await User.findAll({
        attributes: ['NguoiDungId', 'TenDangNhap', 'Account', 'DiaChi', 'SoDienThoai', 'VaiTro'] // Lấy các trường cần thiết
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
        return { warning: 'Người dùng không tồn tại.', status: 201 }; // Nếu không tìm thấy người dùng
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

module.exports = { register, login, getAllUsers, deleteUser, updateUser, checkLoginStatus };
