// models/ChiTietDonHangDaDangNhap.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const DonHangDaDangNhap = require('./DonHangDaDangNhap');
const SanPham = require('./productModel');
const ChiTietSanPham = require('./chitietsanphamModels');

const ChiTietDonHangDaDangNhap = sequelize.define('ChiTietDonHangDaDangNhap', {
  ChiTietDonHangId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  DonHangId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  SanPhamId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  ChiTietSanPhamId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  SoLuong: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  Gia: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
}, {
  tableName: 'ChiTietDonHangDaDangNhap',
  timestamps: false,  // Không sử dụng createdAt, updatedAt
});

// Mối quan hệ giữa ChiTietDonHangDaDangNhap và các mô hình khác
ChiTietDonHangDaDangNhap.belongsTo(SanPham, {
  foreignKey: 'SanPhamId',
  onDelete: 'CASCADE',
});

ChiTietDonHangDaDangNhap.belongsTo(ChiTietSanPham, {
  foreignKey: 'ChiTietSanPhamId',
  onDelete: 'CASCADE',
});

module.exports = ChiTietDonHangDaDangNhap;
