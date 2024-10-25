// controllers/userController.js

const pool = require('../config/database');
const UserService = require('../services/userService'); // Đường dẫn có thể thay đổi tùy vào cấu trúc thư mục của bạn

// Lấy danh sách người dùng từ cơ sở dữ liệu
const getUsers = async (req, res) => {
    try {
        const users = await UserService.getAllUsers(); // Gọi đến UserService để lấy tất cả người dùng
        return res.status(200).json({ status: 'success', data: users }); // Trả kết quả về cho client
    } catch (error) {
        return res.status(500).json({ message: 'Lỗi truy vấn cơ sở dữ liệu', error: error.message }); // Xử lý lỗi nếu có
    }
};

// Đăng ký người dùng
const registerUser = async (req, res) => {
    try {
        const newUser = await UserService.register(req.body);
        return res.status(201).json({ status: 'success', message: 'Người dùng đã được tạo thành công!', userId: newUser.NguoiDungId });
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};



// Controller loginUser
const loginUser = async (req, res) => {
    try {
        // Gọi hàm login từ UserService để xác thực người dùng
        const user = await UserService.login(req.body);

        // Kiểm tra xem user có hợp lệ không
        if (!user || !user.NguoiDungId) {
            throw new Error('Không tìm thấy thông tin người dùng.');
        }

        // Lưu thông tin người dùng vào session
        req.session.user = {
            NguoiDungId: user.NguoiDungId,
            TenDangNhap: user.TenDangNhap,
            Email: user.Email,
            DiaChi: user.DiaChi,
            SoDienThoai: user.SoDienThoai,
            VaiTro: user.VaiTro,
            ThoiGianTao: user.ThoiGianTao
        };

        // Trả về thông báo thành công và thông tin người dùng
        return res.status(200).json({ 
            message: 'Đăng nhập thành công!', 
            user: req.session.user // Trả về thông tin người dùng từ session
        });
    } catch (error) {
        console.error('Lỗi khi đăng nhập:', error); // Log lỗi
        return res.status(400).json({ message: error.message });
    }
};




// Xóa người dùng
const deleteUser = async (req, res) => {
    const { nguoiDungId } = req.params; // Lấy nguoiDungId từ tham số URL

    try {
        const deletedUser = await UserService.deleteUser(nguoiDungId);
        return res.status(200).json({ status: 'success', message: 'Người dùng đã được xóa thành công!', deletedUser });
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};



// Cập nhật người dùng
const updateUser = async (req, res) => {
    const { nguoiDungId } = req.params; // Lấy nguoiDungId từ tham số URL
    const userData = req.body; // Lấy dữ liệu người dùng từ body

    try {
        const updatedUser = await UserService.updateUser(nguoiDungId, userData);
        return res.status(200).json({ status: 'success', message: 'Người dùng đã được cập nhật thành công!', updatedUser });
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};

module.exports = { getUsers, registerUser, loginUser, deleteUser , updateUser };
