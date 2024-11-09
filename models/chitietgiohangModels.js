const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Điều chỉnh đường dẫn tới tệp database của bạn
const GioHang = require('./cartModels'); // Điều chỉnh đường dẫn tới tệp GioHang
const SanPham = require('./productModel'); // Điều chỉnh đường dẫn tới tệp SanPham
const ChiTietSanPham = require('./chitietsanphamModels');

const ChiTietGioHang = sequelize.define('ChiTietGioHang', {
    ChiTietGioHangId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    GioHangId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: GioHang,
            key: 'GioHangId',
        },
        onDelete: 'CASCADE',
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
    SoLuong: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    ChiTietSanPhamId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: ChiTietSanPham,
            key: 'ChiTietSanPhamId',
        },
        onDelete: 'CASCADE',
    },
}, {
    tableName: 'ChiTietGioHang', // Chỉ định rõ tên bảng
    timestamps: false, // Tắt tự động thêm createdAt và updatedAt
});

// Mối quan hệ với bảng `SanPham`
// ChiTietGioHang.belongsTo(SanPham, {foreignKey: 'SanPhamId',});
// SanPham.hasMany(ChiTietGioHang, { foreignKey: 'SanPhamId' });


module.exports = ChiTietGioHang;
