// controllers/userController.js
const pool = require('../config/database');
const { generateToken } = require('../config/jwt');
const User = require('../models/userModel');
const UserService = require('../services/userService'); // Đường dẫn có thể thay đổi tùy vào cấu trúc thư mục của bạn
const bcrypt = require('bcryptjs');
const { Op } = require('sequelize');
const jwt = require('jsonwebtoken');
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
const getUserById = async (req, res) => {
    const { nguoiDungId } = req.params; // Lấy NguoiDungId từ tham số đường dẫn

    try {
        // Tìm người dùng theo NguoiDungId
        const user = await User.findOne({
            where: { NguoiDungId: nguoiDungId }, // Điều kiện tìm kiếm
            attributes: ['NguoiDungId', 'TenDangNhap', 'Account', 'DiaChi', 'SoDienThoai', 'VaiTro'] // Lấy các trường cần thiết
        });

        // Kiểm tra xem người dùng có tồn tại không
        if (!user) {
            return res.status(404).json({ error: 'Người dùng không tồn tại' }); // Nếu không tìm thấy người dùng
        }

        return res.status(200).json(user); // Trả kết quả về cho client

    } catch (error) {
        return res.status(500).json({ error: 'Lỗi truy vấn cơ sở dữ liệu', message: error.message }); // Xử lý lỗi nếu có
    }
};

// Đăng ký người dùng
const createUser = async (req, res) => {
    const { TenDangNhap, MatKhau, Account, DiaChi, SoDienThoai, VaiTro } = req.body;
    const role = VaiTro || 'user';

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
    if (!MatKhau) {
        return res.status(201).json({ warning: 'Vui lòng nhập mật khẩu.' })
    }
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

// Controller loginUser

const loginUser = async (req, res) => {
    const { Account, MatKhau } = req.body; // Lấy Ten

    if (!Account) {
        return res.status(201).json({ warning: 'Vui lòng nhập tài khoản.' })
    }
    if (!MatKhau) {
        return res.status(201).json({ warning: 'Vui lòng nhập mật khẩu.' })
    }

    try {
        const user = await User.findOne({ where: { Account } });
        const isMatch = await bcrypt.compare(MatKhau, user.MatKhau);

        if (!user) {
            return res.status(201).json({ warning: 'Tài khoản không tồn tại.' }); // Nếu trùng lặp
        }
        if (!isMatch) {
            return res.status(201).json({ warning: 'Mật khẩu không chính xác.' });
        }
         // Lưu thông tin người dùng vào req
    // req.user = {
    //     NguoiDungId: user.NguoiDungId,
    //     Account: user.Account,
    // };
        const ss_account = generateToken(user.NguoiDungId, user.Account);
        res.cookie('ss_account', ss_account, { httpOnly: true }); // Lưu token vào cookie
        return res.status(200).json({ message: 'Đăng nhập thành công.', ss_account });

    } catch (error) {
        // console.error('Lỗi khi đăng nhập:', error); // Log lỗi
        return res.status(500).json({ error: error.message });
    }
};


// const loginUser = async (req, res) => {
//     const { Account, MatKhau } = req.body; // Lấy Tài khoản

//     // Kiểm tra thông tin đầu vào
//     if (!Account) {
//         return res.status(400).json({ warning: 'Vui lòng nhập tài khoản.' });
//     }
//     if (!MatKhau) {
//         return res.status(400).json({ warning: 'Vui lòng nhập mật khẩu.' });
//     }

//     try {
//         const user = await User.findOne({ where: { Account } });
        
//         // Kiểm tra xem người dùng có tồn tại không
//         if (!user) {
//             return res.status(404).json({ warning: 'Tài khoản không tồn tại.' });
//         }
        
//         // So sánh mật khẩu
//         const isMatch = await bcrypt.compare(MatKhau, user.MatKhau);
//         if (!isMatch) {
//             return res.status(401).json({ warning: 'Mật khẩu không chính xác.' });
//         }

//         // Lưu thông tin người dùng vào req
//         req.user = {
//             NguoiDungId: user.NguoiDungId,
//             Account: user.Account,
//             Email: user.Account,
//             DiaChi: user.DiaChi,
//             SoDienThoai: user.SoDienThoai,
//             VaiTro: user.VaiTro,
//             ThoiGianTao: user.ThoiGianTao
//         };

//         // Kiểm tra xem thông tin người dùng đã được lưu vào req hay chưa
//         if (req.user) {
//             console.log('Người dùng đã được lưu vào req:', req.user);
//         } else {
//             console.log('Không tìm thấy người dùng trong req.');
//             return res.status(500).json({ warning: 'Không thể lưu thông tin người dùng vào req.' });
//         }

//         // Nếu có session, lưu người dùng vào session
//         // if (req.session) {
//         //     req.session.user = user;
//         // }

//         // Tạo token và trả về thông tin thành công
//         const ss_account = generateToken(user.NguoiDungId, user.Account);
//         return res.status(200).json({ message: 'Đăng nhập thành công.', ss_account });

//     } catch (error) {
//         console.error('Lỗi khi đăng nhập:', error); // Log lỗi
//         return res.status(500).json({ error: error.message });
//     }
// };




// const loginUser = async (req, res) => {
//     const { Account, MatKhau } = req.body;

//     if (!Account) {
//         return res.status(201).json({ warning: 'Vui lòng nhập tài khoản.' });
//     }
//     if (!MatKhau) {
//         return res.status(201).json({ warning: 'Vui lòng nhập mật khẩu.' });
//     }

//     try {
//         const user = await User.findOne({ where: { Account } });
//         if (!user) {
//             return res.status(201).json({ warning: 'Tài khoản không tồn tại.' });
//         }

//         const isMatch = await bcrypt.compare(MatKhau, user.MatKhau);
//         if (!isMatch) {
//             return res.status(201).json({ warning: 'Mật khẩu không chính xác.' });
//         }
//   // Xóa cookie nếu tồn tại
//     // Xóa cookie nếu tồn tại

//         const ss_account = generateToken(user.NguoiDungId, user.Account);
//         res.cookie('ss_account', ss_account, { httpOnly: true }); // Lưu token vào cookie

//         return res.status(200).json({ message: 'Đăng nhập thành công.', ss_account });
//     } catch (error) {
//         return res.status(500).json({ error: error.message });
//     }
// };


const checkLogin = (req, res) => {
    const token = req.cookies.ss_account; // Lấy token từ cookie

    // Kiểm tra nếu không có token
    if (!token) {
        return res.status(401).json({
            loggedIn: false,
            message: 'Người dùng chưa đăng nhập.',
        });
    }

    try {
        // Xác thực token
        
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Nếu token hợp lệ, trả về thông tin người dùng

        return res.status(200).json({
            loggedIn: true,
            user: {
                NguoiDungId: decoded.id, // Lấy NguoiDungId từ token
                Account: decoded.Account, // Lấy tài khoản từ token
                MatKhau: decoded.MatKhau,
            },
        });
    } catch (error) {
        console.error('Lỗi khi kiểm tra trạng thái đăng nhập:', error);
        return res.status(401).json({
            loggedIn: false,
            message: 'Token không hợp lệ hoặc đã hết hạn.',
        });
    }
};



// const checkLogin = (req, res) => {
//     try {
//         const status = UserService.checkLoginStatus(req);
//         return res.status(200).json(status);
//     } catch (error) {
//         console.error('Lỗi khi kiểm tra trạng thái đăng nhập:', error);
//         return res.status(500).json({ message: 'Có lỗi xảy ra trong quá trình kiểm tra đăng nhập.' });
//     }
// };
// Hàm logout
const logoutUser = (req, res) => {
    try {
        // Xóa thông tin người dùng khỏi req
        if (req.user) {
            req.user = null; // Đặt req.user về null
        }

        // Xóa token hoặc cookie liên quan nếu có
        res.clearCookie('ss_account'); // Xóa cookie chứa token nếu bạn sử dụng cookie

        // Trả về phản hồi thành công
        return res.status(200).json({ message: 'Đăng xuất thành công.' });
    } catch (error) {
        console.error('Lỗi khi đăng xuất:', error);
        return res.status(500).json({ message: 'Có lỗi xảy ra trong quá trình đăng xuất.' });
    }
};






module.exports = { getUsers, createUser, loginUser, deleteUser, updateUser, checkLogin, logoutUser ,getUserById };
