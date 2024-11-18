
const jwt = require('jsonwebtoken');
const generateToken = (userId, Account) => {
  return jwt.sign({ id: userId, Account }, process.env.JWT_SECRET, {
    expiresIn: '1d',
  });
};

const generateTokenInfo = (TenDangNhap, DiaChi, SoDienThoai) => {
  return jwt.sign({ TenDangNhap, DiaChi, SoDienThoai }, process.env.JWT_SECRET, {
    expiresIn: '1d',
  });
};

const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

module.exports = { generateToken, generateTokenInfo, verifyToken };
