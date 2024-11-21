// models/DonHangDaDangNhap.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ChiTietDonHangDaDangNhap = require('./ChiTietDonHangDaDangNhap');
const User = require('./userModel');
const ThanhToan = require('./thanhtoanModel');

const DonHangDaDangNhap = sequelize.define('DonHangDaDangNhap', {
  DonHangId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  NguoiDungId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  TongTien: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  TrangThai: {
    type: DataTypes.ENUM('dangxu ly', 'Chờ Giao Hàng', 'Đang Giao', 'Hoàn Thành', 'Hủy'),
    defaultValue: 'dangxu ly',
  },
  ThoiGianTao: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'DonHangDaDangNhap',
  timestamps: false,
});

// Mối quan hệ với ChiTietDonHangDaDangNhap
DonHangDaDangNhap.hasMany(ChiTietDonHangDaDangNhap, {
  foreignKey: 'DonHangId',
  onDelete: 'CASCADE',
});
DonHangDaDangNhap.hasMany(ThanhToan, {
  foreignKey: 'DonHangId',
  onDelete: 'CASCADE',
});

DonHangDaDangNhap.belongsTo(User, { foreignKey: 'NguoiDungId', onDelete: 'CASCADE', });
module.exports = DonHangDaDangNhap;