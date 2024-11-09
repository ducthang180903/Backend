const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const SanPham = require('./productModel');

const ChiTietSanPham = sequelize.define('ChiTietSanPham', {
  ChiTietSanPhamId: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  SanPhamId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: SanPham,
      key: 'SanPhamId',
    },
    onDelete: 'CASCADE',
  },
  LoaiChiTiet: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  Gia: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  SoLuong: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  ThoiGianTao: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  ThoiGianCapNhat: {
    type: DataTypes.DATE, 
    defaultValue: DataTypes.NOW,
    onUpdate: DataTypes.NOW,
  },
}, {
  tableName: 'chitietsanpham',
  timestamps: false,
});

ChiTietSanPham.belongsTo(SanPham, { foreignKey: 'SanPhamId' });
SanPham.hasMany(ChiTietSanPham, { foreignKey: 'SanPhamId' });

module.exports = ChiTietSanPham;
