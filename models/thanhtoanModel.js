// models/ThanhToan.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Đảm bảo bạn có cấu hình sequelize trong database.js

const ThanhToan = sequelize.define('ThanhToan', {
    ThanhToanId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    DonHangId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    PhuongThuc: {
        type: DataTypes.ENUM('Zalo Pay', 'COD'),
        allowNull: false,
    },
    TrangThaiThanhToan: {
        type: DataTypes.ENUM('dangxu ly', 'hoantat', 'thatbai'),
        defaultValue: 'dangxu ly',
        allowNull: true,
    },
    ThoiGianTao: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
}, {
    tableName: 'ThanhToan',
    timestamps: false, // Không cần trường createdAt, updatedAt
});

// Thiết lập quan hệ với bảng DonHang (nếu cần)
ThanhToan.associate = (models) => {
    ThanhToan.belongsTo(models.DonHang, {
        foreignKey: 'DonHangId',
        as: 'donhang', // Tên quan hệ khi truy vấn
    });
};

module.exports = ThanhToan;