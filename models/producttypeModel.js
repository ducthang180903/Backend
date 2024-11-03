const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Giả sử bạn đã cấu hình kết nối trong database.js


const LoaiSanPham = sequelize.define('LoaiSanPham', {
  LoaiSanPhamId: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  TenLoai: {
    type: DataTypes.STRING(100),
    allowNull: false
  }
}, {
  tableName: 'LoaiSanPham', // Tên bảng trong cơ sở dữ liệu
  timestamps: false,        // Không sử dụng createdAt, updatedAt
});

module.exports = LoaiSanPham;
