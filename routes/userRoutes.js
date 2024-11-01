// routes/userRoutes.js

const express = require('express');
const { loginUser, getUsers, updateUser, deleteUser, checkLogin, logoutUser, createUser, deleteUsers } = require('../controllers/userController');
const router = express.Router();

// Route để lấy danh sách người dùng
router.get('/users', getUsers);

router.post('/users', createUser);

// Sửa thông tin người dùng
router.put('/users/:nguoiDungId', updateUser); // Sử dụng PUT cho việc sửa

// Xóa người dùng
router.delete('/users/:nguoiDungId', deleteUser); // Sử dụng DELETE cho việc xóa
router.post('/users/delete', deleteUsers);// Xóa nhiều data
//  Đăng ký người dùng
router.post('/register', createUser);

//  Đăng nhập người dùng
router.post('/login', loginUser);
router.get('/check-login', checkLogin);
router.post('/logout', logoutUser);

module.exports = router;
