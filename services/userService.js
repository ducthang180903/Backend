const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('../config/jwt');

const register = async (userData) => {
  const { TenDangNhap, MatKhau, Email } = userData;

  // Hash mật khẩu
  const hashedPassword = bcrypt.hashSync(MatKhau, 10);

  const newUser = await User.create({
    TenDangNhap,
    MatKhau: hashedPassword,
    Email,
  });

  return newUser;
};

const login = async (userData) => {
  const { TenDangNhap, MatKhau } = userData;
  const user = await User.findOne({ where: { TenDangNhap } });

  if (!user) throw new Error('Tên đăng nhập không tồn tại');

  const isMatch = bcrypt.compareSync(MatKhau, user.MatKhau);
  if (!isMatch) throw new Error('Mật khẩu không chính xác');

  const token = jwt.generateToken(user.NguoiDungId);
  return token;
};

module.exports = { register, login };
