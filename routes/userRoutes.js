// routes/userRoutes.js

const express = require('express');
const { registerUser, loginUser, getUsers ,updateUser, deleteUser  } = require('../controllers/userController');
const router = express.Router();

// Route để lấy danh sách người dùng
router.get('/users', getUsers);
// Sửa thông tin người dùng
router.put('/users/:nguoiDungId', updateUser); // Sử dụng PUT cho việc sửa

// Xóa người dùng
router.delete('/users/:nguoiDungId', deleteUser); // Sử dụng DELETE cho việc xóa
//  Đăng ký người dùng
router.post('/register', registerUser);

//  Đăng nhập người dùng
router.post('/login', loginUser);


module.exports = router;
