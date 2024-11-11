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
    tableName: 'ChiTietGioHang',
    timestamps: false,
});

// Định nghĩa mối quan hệ
ChiTietGioHang.belongsTo(GioHang, { foreignKey: 'GioHangId' });
ChiTietGioHang.belongsTo(SanPham, { foreignKey: 'SanPhamId' });
ChiTietGioHang.belongsTo(ChiTietSanPham, { foreignKey: 'ChiTietSanPhamId' });

module.exports = ChiTietGioHang;
