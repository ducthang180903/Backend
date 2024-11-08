// models/donViTinhModel.js

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Đảm bảo đường dẫn đúng tới file cấu hình cơ sở dữ liệu

const DonViTinh = sequelize.define('DonViTinh', {
    DonViTinhID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    TenDonVi: {
        type: DataTypes.STRING(50),
        allowNull: false,
    }
}, {
    tableName: 'DonViTinh', // Tên bảng trong cơ sở dữ liệu
    timestamps: false // Nếu không cần trường createdAt và updatedAt
});

// Xuất mô hình để sử dụng
module.exports = DonViTinh;
