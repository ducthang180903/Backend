// controllers/userController.js

const pool = require('../config/database');

// Lấy danh sách người dùng từ cơ sở dữ liệu
const getUsers = async (req, res) => {
    try {
      const [results] = await pool.query('SELECT * FROM NguoiDung'); // Sử dụng await để lấy danh sách người dùng
      res.json(results); // Trả kết quả về cho client
    } catch (err) {
      return res.status(500).json({ error: 'Lỗi truy vấn cơ sở dữ liệu' }); // Xử lý lỗi nếu có
    }
  };

// Đăng ký người dùng
const registerUser = async (req, res) => {
    const { TenDangNhap, MatKhau, Email, DiaChi, SoDienThoai } = req.body;

    try {
        // Kiểm tra tên đăng nhập và email có tồn tại hay không
        const checkQuery = 'SELECT * FROM NguoiDung WHERE TenDangNhap = ? OR Email = ?';
        const [existingUsers] = await pool.query(checkQuery, [TenDangNhap, Email]);

        if (existingUsers.length > 0) {
            return res.status(400).json({ message: 'Tên đăng nhập hoặc email đã tồn tại.' });
        }

        // Nếu không tồn tại, thêm người dùng mới
        const insertQuery = 'INSERT INTO NguoiDung (TenDangNhap, MatKhau, Email, DiaChi, SoDienThoai) VALUES (?, ?, ?, ?, ?)';
        const [result] = await pool.query(insertQuery, [TenDangNhap, MatKhau, Email, DiaChi, SoDienThoai]);

        res.status(201).json({ message: 'Người dùng đã được tạo thành công!', userId: result.insertId });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Đăng nhập người dùng
const loginUser = async (req, res) => {
    const { TenDangNhap, MatKhau } = req.body;

    try {
        // Kiểm tra tên đăng nhập hoặc email
        const query = 'SELECT * FROM NguoiDung WHERE TenDangNhap = ? OR Email = ?';
        const [results] = await pool.query(query, [TenDangNhap, TenDangNhap]);

        if (results.length === 0) {
            // Tên đăng nhập hoặc email không tồn tại
            return res.status(400).json({ message: 'Tên đăng nhập hoặc email không tồn tại.' });
        }

        const user = results[0];

        // Kiểm tra mật khẩu
        if (MatKhau !== user.MatKhau) {
            // Mật khẩu không chính xác
            return res.status(401).json({ message: 'Mật khẩu không chính xác.' });
        }

        // Lưu thông tin người dùng vào session (nếu cần thiết)
        req.session.userId = user.NguoiDungId;

        // Trả về thông báo đăng nhập thành công
        res.json({ message: 'Đăng nhập thành công!', userId: user.NguoiDungId });
    } catch (error) {
        // Xử lý lỗi và trả về mã lỗi 500 cho các lỗi không lường trước
        res.status(500).json({ error: error.message });
    }
};
// Xóa người dùng
const deleteUser = async (req, res) => {
    const { nguoiDungId } = req.params; // Lấy nguoiDungId từ tham số URL

    try {
        // Kiểm tra xem người dùng có tồn tại không
        const checkQuery = 'SELECT * FROM NguoiDung WHERE NguoiDungId = ?';
        const [existingUsers] = await pool.query(checkQuery, [nguoiDungId]);

        if (existingUsers.length === 0) {
            return res.status(404).json({ message: 'Người dùng không tồn tại.' });
        }

        // Xóa người dùng
        const deleteQuery = 'DELETE FROM NguoiDung WHERE NguoiDungId = ?';
        await pool.query(deleteQuery, [nguoiDungId]);

        res.json({ message: 'Người dùng đã được xóa thành công!' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Sửa thông tin người dùng
const updateUser = async (req, res) => {
    const { nguoiDungId } = req.params; // Lấy nguoiDungId từ tham số URL
    const { TenDangNhap, Email, DiaChi, SoDienThoai } = req.body; // Lấy thông tin mới từ body

    try {
        // Kiểm tra xem người dùng có tồn tại không
        const checkQuery = 'SELECT * FROM NguoiDung WHERE NguoiDungId = ?';
        const [existingUsers] = await pool.query(checkQuery, [nguoiDungId]);

        if (existingUsers.length === 0) {
            return res.status(404).json({ message: 'Người dùng không tồn tại.' });
        }

        // Kiểm tra tên đăng nhập và email có tồn tại hay không
        const checkDuplicateQuery = 'SELECT * FROM NguoiDung WHERE (TenDangNhap = ? OR Email = ?) AND NguoiDungId != ?';
        const [duplicateUsers] = await pool.query(checkDuplicateQuery, [TenDangNhap, Email, nguoiDungId]);

        if (duplicateUsers.length > 0) {
            return res.status(400).json({ message: 'Tên đăng nhập hoặc email đã tồn tại.' });
        }

        // Cập nhật thông tin người dùng
        const updateQuery = 'UPDATE NguoiDung SET TenDangNhap = ?, Email = ?, DiaChi = ?, SoDienThoai = ? WHERE NguoiDungId = ?';
        await pool.query(updateQuery, [TenDangNhap, Email, DiaChi, SoDienThoai, nguoiDungId]);

        res.json({ message: 'Thông tin người dùng đã được cập nhật thành công!' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};



module.exports = { getUsers, registerUser, loginUser, deleteUser , updateUser };
