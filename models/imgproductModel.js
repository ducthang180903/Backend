const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const SanPham = require('./productModel');

const HinhAnhSanPham = sequelize.define('HinhAnhSanPham', {
    HinhAnhId: {
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
    },
    DuongDanHinh: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
}, {
    tableName: 'HinhAnhSanPham',
    timestamps: false,
});

// Thiết lập mối quan hệ
HinhAnhSanPham.belongsTo(SanPham, { foreignKey: 'SanPhamId' });
SanPham.hasMany(HinhAnhSanPham, { foreignKey: 'SanPhamId' });
module.exports = HinhAnhSanPham;
