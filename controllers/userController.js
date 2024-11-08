// controllers/userController.js
const pool = require('../config/database');
const { generateToken } = require('../config/jwt');
const User = require('../models/userModel');
const UserService = require('../services/userService'); // Đường dẫn có thể thay đổi tùy vào cấu trúc thư mục của bạn
const bcrypt = require('bcryptjs');
const { Op } = require('sequelize');

// Lấy danh sách người dùng từ cơ sở dữ liệu
const getUsers = async (req, res) => {
    try {
        const users = await User.findAll({
            attributes: ['NguoiDungId', 'TenDangNhap', 'Account', 'DiaChi', 'SoDienThoai', 'VaiTro'] // Lấy các trường cần thiết
        });
        return res.status(200).json(users); // Trả kết quả về cho client

    } catch (error) {
        return res.status(500).json({ error: 'Lỗi truy vấn cơ sở dữ liệu', error: error.message }); // Xử lý lỗi nếu có
    }
};

// Đăng ký người dùng
const createUser = async (req, res) => {
    const { TenDangNhap, MatKhau, Account, DiaChi, SoDienThoai, VaiTro } = req.body;
    const role = VaiTro || 'user';
    // return res.status(200).json({ message: 'Check: ', TenDangNhap, MatKhau, Account, DiaChi, SoDienThoai, VaiTro });

    try {
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
            return res.status(201).json({ warning: 'Tên đăng nhập hoặc tài khoản đã tồn tại.' });
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
            return res.status(200).json({ message: 'Người dùng đã được tạo thành công!', newUser });
        }

    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

// Cập nhật người dùng
const updateUser = async (req, res) => {
    const { nguoiDungId } = req.params; // Lấy nguoiDungId từ tham số URL
    const { TenDangNhap, MatKhau, Account, DiaChi, SoDienThoai, VaiTro } = req.body; // Lấy dữ liệu người dùng từ body
    const role = VaiTro || 'user';

    if (!TenDangNhap) {
        return res.status(201).json({ warning: 'Vui lòng nhập tên đăng nhập.' })
    }
    // if (!MatKhau) {
    //     return res.status(201).json({ warning: 'Vui lòng nhập mật khẩu.' })
    // }
    if (!Account) {
        return res.status(201).json({ warning: 'Vui lòng nhập tài khoản.' })
    }
    if (!DiaChi) {
        return res.status(201).json({ warning: 'Vui lòng nhập địa chỉ.' })
    }
    if (!SoDienThoai) {
        return res.status(201).json({ warning: 'Vui lòng nhập SĐT.' })
    }
    if (!VaiTro) {
        return res.status(201).json({ warning: 'Vui lòng nhập vai trò.' })
    }

    try {
        const user = await User.findOne({
            where: { NguoiDungId: nguoiDungId }
        });

        if (!user) {
            return res.status(201).json({ warning: 'Người dùng không tồn tại.' }); // Nếu không tìm thấy người dùng
        }
        // Kiểm tra xem tên đăng nhập hoặc email đã tồn tại trong cơ sở dữ liệu không
        const existingUser = await User.findOne({
            where: {
                [Op.or]: [
                    // Kiểm tra tên đăng nhập
                    {
                        TenDangNhap,
                        // Chỉ kiểm tra nếu tên đăng nhập không phải của người dùng hiện tại
                        NguoiDungId: { [Op.ne]: nguoiDungId }
                    },
                    // Kiểm tra tài khoản
                    {
                        Account,
                        // Chỉ kiểm tra nếu tài khoản không phải của người dùng hiện tại
                        NguoiDungId: { [Op.ne]: nguoiDungId }
                    }
                ]
            }
        });

        if (existingUser) {
            return res.status(201).json({ warning: 'Tên đăng nhập hoặc tài khoản đã tồn tại.' }); // Nếu trùng lặp
        }

        // Mã hóa mật khẩu nếu có thay đổi mật khẩu
        const hashedPassword = MatKhau ? await bcrypt.hash(MatKhau, 10) : user.MatKhau;

        const updatedUser = await User.update({
            TenDangNhap,
            MatKhau: hashedPassword,
            Account,
            DiaChi,
            SoDienThoai,
            VaiTro: role
        },
            {
                where: { NguoiDungId: nguoiDungId },
            });
        return res.status(200).json({ message: 'Người dùng đã được cập nhật thành công!', updatedUser });
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};

// Xóa người dùng
const deleteUser = async (req, res) => {
    const { nguoiDungId } = req.params; // Lấy nguoiDungId từ tham số URL

    try {
        const user = await User.findOne({
            where: {
                NguoiDungId: nguoiDungId
            }
        });
        const deleteUser = await User.destroy({
            where: {
                NguoiDungId: nguoiDungId
            }
        });

        if (!user) {
            return res.status(201).json({ warning: 'Người dùng không tồn tại.' }); // Nếu không tìm thấy người dùng
        }
        return res.status(200).json({ message: 'Người dùng đã được xóa thành công!', deleteUser });
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};

const deleteUsers = async (req, res) => {
    const data = req.body;

    if (!Array.isArray(data) || data.length === 0) {
        return res.status(201).json({ warning: "Danh sách người dùng không hợp lệ!" });
    }

    try {
        const deleteUser = await User.destroy({
            where: {
                NguoiDungId: data
            }
        });

        if (deleteUser === 0) {
            return res.status(201).json({ warning: "Không tìm thấy người dùng nào để xóa!" });
        }

        return res.status(200).json({ message: `Đã xóa thành công ${deleteUser} người dùng` });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

// Controller loginUser
const loginUser = async (req, res) => {
    const { Account, MatKhau } = req.body; // Lấy Ten
    // return res.status(200).json({ message: 'check: ', Account, MatKhau });
    if (!Account) {
        return res.status(201).json({ warning: 'Vui lòng nhập tài khoản.' })
    }
    if (!MatKhau) {
        return res.status(201).json({ warning: 'Vui lòng nhập mật khẩu.' })
    }

    try {
        const user = await User.findOne({ where: { Account } });
        // return res.json({ message: 'check account: ', user });

        if (!user) {
            return res.status(201).json({ warning: 'Tài khoản không tồn tại.' }); // Nếu trùng lặp
        }

        const isMatch = await bcrypt.compare(MatKhau, user.MatKhau);

        if (!isMatch) {
            return res.status(201).json({ warning: 'Mật khẩu không chính xác.' });
        }

        const ss_account = generateToken(user.NguoiDungId, user.Account);
        const account_user = user.TenDangNhap;
        // return res.json({ message: 'check: ', account_user });
        req.session.user = ss_account;
        await req.session.save()
       // res.cookie('ss_account', ss_account, { httpOnly: true }); // Lưu token vào cookie
        return res.status(200).json({ message: 'Đăng nhập thành công.', ss_account, account_user });

    } catch (error) {
        // console.error('Lỗi khi đăng nhập:', error); // Log lỗi
        return res.status(500).json({ error: error.message });
    }
};

const checkLogin = (req, res) => {
    try {
        const status = UserService.checkLoginStatus(req);
        return res.status(200).json(status);
    } catch (error) {
        console.error('Lỗi khi kiểm tra trạng thái đăng nhập:', error);
        return res.status(500).json({ message: 'Có lỗi xảy ra trong quá trình kiểm tra đăng nhập.' });
    }
};
// Hàm logout
const logoutUser = async (req, res) => {
    try {
        req.session.destroy((err) => {
            if (err) {
                return res.status(201).json({ error: 'Đăng xuất thất bại.' });
            }

            res.clearCookie('SSID');
            return res.status(200).json({ message: 'Đăng xuất thành công!' });
        });

    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};
const updateUserNDSDT = async (req, res) => {
    const { nguoiDungId } = req.params; // Lấy nguoiDungId từ tham số URL
    const { TenDangNhap, MatKhau, Account, DiaChi, SoDienThoai, VaiTro } = req.body; // Lấy dữ liệu người dùng từ body

    try {
        const user = await User.findOne({
            where: { NguoiDungId: nguoiDungId }
        });

        if (!user) {
            return res.status(404).json({ warning: 'Người dùng không tồn tại.' });
        }

        // Kiểm tra xem tên đăng nhập hoặc tài khoản đã tồn tại trong cơ sở dữ liệu không
        if (TenDangNhap && TenDangNhap !== user.TenDangNhap) {
            const existingUser = await User.findOne({
                where: { TenDangNhap, NguoiDungId: { [Op.ne]: nguoiDungId } }
            });
            if (existingUser) {
                return res.status(400).json({ warning: 'Tên đăng nhập đã tồn tại.' });
            }
        }

        if (Account && Account !== user.Account) {
            const existingAccount = await User.findOne({
                where: { Account, NguoiDungId: { [Op.ne]: nguoiDungId } }
            });
            if (existingAccount) {
                return res.status(400).json({ warning: 'Tài khoản đã tồn tại.' });
            }
        }

        // Mã hóa mật khẩu nếu có thay đổi mật khẩu
        const hashedPassword = MatKhau ? await bcrypt.hash(MatKhau, 10) : user.MatKhau;

        // Cập nhật thông tin chỉ khi có thay đổi
        const updatedData = {};

        if (DiaChi) updatedData.DiaChi = DiaChi;
        if (SoDienThoai) updatedData.SoDienThoai = SoDienThoai;
        if (MatKhau) updatedData.MatKhau = hashedPassword;
        if (TenDangNhap) updatedData.TenDangNhap = TenDangNhap;
        if (Account) updatedData.Account = Account;
        if (VaiTro) updatedData.VaiTro = VaiTro;

        await User.update(updatedData, {
            where: { NguoiDungId: nguoiDungId },
        });

        return res.status(200).json({ message: 'Người dùng đã được cập nhật thành công!', updatedData });
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};

module.exports = { getUsers, createUser, loginUser, deleteUser, deleteUsers, updateUser, checkLogin, logoutUser ,updateUserNDSDT };
