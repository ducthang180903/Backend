const { check } = require('express-validator');

const registerValidator = [
  check('TenDangNhap').notEmpty().withMessage('Tên đăng nhập là bắt buộc'),
  check('MatKhau').isLength({ min: 6 }).withMessage('Mật khẩu phải dài ít nhất 6 ký tự'),
  check('Email').isEmail().withMessage('Email không hợp lệ'),
];

module.exports = { registerValidator };
