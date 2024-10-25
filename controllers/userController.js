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


// Đăng nhập người dùng
const loginUser = async (req, res) => {
    try {
      const token = await UserService.login(req.body);
      return res.status(200).json({ token });
    } catch (error) {
      return res.status(400).json({ message:'lỗi' });
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





// Sửa thông tin người dùng
// const updateUser = async (req, res) => {
//     const { nguoiDungId } = req.params; // Lấy nguoiDungId từ tham số URL
//     const { TenDangNhap, Email, DiaChi, SoDienThoai } = req.body; // Lấy thông tin mới từ body

//     try {
//         // Kiểm tra xem người dùng có tồn tại không
//         const checkQuery = 'SELECT * FROM NguoiDung WHERE NguoiDungId = ?';
//         const [existingUsers] = await pool.query(checkQuery, [nguoiDungId]);

//         if (existingUsers.length === 0) {
//             return res.status(201).json({ status: 'warning', message: 'Người dùng không tồn tại.' });
//         }

//         // Kiểm tra tên đăng nhập và email có trùng lặp không
//         const checkDuplicateQuery = 'SELECT * FROM NguoiDung WHERE (TenDangNhap = ? OR Email = ?) AND NguoiDungId != ?';
//         const [duplicateUsers] = await pool.query(checkDuplicateQuery, [TenDangNhap, Email, nguoiDungId]);

//         if (duplicateUsers.length > 0) {
//             return res.status(201).json({ status: 'warning', message: 'Tên đăng nhập hoặc email đã tồn tại.' });
//         }

//         // Cập nhật thông tin người dùng
//         const updateQuery = 'UPDATE NguoiDung SET TenDangNhap = ?, Email = ?, DiaChi = ?, SoDienThoai = ? WHERE NguoiDungId = ?';
//         await pool.query(updateQuery, [TenDangNhap, Email, DiaChi, SoDienThoai, nguoiDungId]);

//         res.status(200).json({ status: 'success', message: 'Thông tin người dùng đã được cập nhật thành công!' });
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// };

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
