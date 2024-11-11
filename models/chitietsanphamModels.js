const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Đảm bảo đường dẫn đúng tới tệp cấu hình cơ sở dữ liệu
const SanPham = require('./productModel'); // Import mô hình SanPham

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
  tableName: 'ChiTietSanPham', // Đảm bảo tên bảng đúng
  timestamps: false,
});

// Thiết lập mối quan hệ
ChiTietSanPham.belongsTo(SanPham, { foreignKey: 'SanPhamId' });
SanPham.hasMany(ChiTietSanPham, { foreignKey: 'SanPhamId' });

module.exports = ChiTietSanPham;