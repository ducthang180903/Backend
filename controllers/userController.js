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
        // Gọi hàm login từ UserService để xác thực người dùng, truyền cả req
        const user = await UserService.login(req.body, req);

        // Kiểm tra xem user có hợp lệ không
        if (!user || !user.NguoiDungId) {
            throw new Error('Không tìm thấy thông tin người dùng.');
        } 

        // Kiểm tra nếu `req.session` tồn tại
        if (req.session) {
            // Lưu thông tin người dùng vào session
            req.session.user = {
                NguoiDungId: user.NguoiDungId,
                TenDangNhap: user.TenDangNhap,
                Email: user.Email,
                DiaChi: user.DiaChi,
                SoDienThoai: user.SoDienThoai,
                VaiTro: user.VaiTro
            };
        } else {
            console.error('Session không tồn tại. Đảm bảo rằng express-session đã được cấu hình.');
        }

        // Trả về thông báo thành công và thông tin người dùng
        return res.status(200).json({ 
            message: 'Đăng nhập thành công!', 
            user: { NguoiDungId: user.NguoiDungId, TenDangNhap: user.TenDangNhap }
        });
    
    } catch (error) {
        console.error('Lỗi khi đăng nhập:', error); // Log lỗi
        return res.status(400).json({ message: error.message });
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
        // Xóa session của người dùng
        req.session.destroy((err) => {
            if (err) {
                console.error('Lỗi khi đăng xuất:', err);
                return res.status(500).json({ message: 'Đăng xuất thất bại.' });
            }
            
            // Xóa cookie session phía client
            res.clearCookie('connect.sid');
            return res.status(200).json({ message: 'Đăng xuất thành công!' });
        });
    } catch (error) {
        console.error('Lỗi khi đăng xuất:', error);
        return res.status(500).json({ message: 'Đăng xuất thất bại.' });
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

module.exports = { getUsers, registerUser, loginUser, deleteUser , updateUser  , checkLogin , logoutUser };
