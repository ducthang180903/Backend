const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('NguoiDung', {
  NguoiDungId: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  TenDangNhap: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true,
  },
  MatKhau: {
    type: DataTypes.STRING(255),
    allowNull: true,//Cho phép ko cần MK
  },
  Account: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
  },
  DiaChi: {
    type: DataTypes.STRING(255),
  },
  SoDienThoai: {
    type: DataTypes.STRING(10),
  },
  VaiTro: {
    type: DataTypes.ENUM('admin', 'quanly', 'user'),
    defaultValue: 'user',
  },
  ThoiGianTao: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'NguoiDung', // Chỉ định tên bảng đã có
  timestamps: false, // Bỏ qua trường createdAt và updatedAt nếu không có
});

module.exports = User;
