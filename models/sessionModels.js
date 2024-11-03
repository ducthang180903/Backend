const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Đảm bảo bạn đã cấu hình kết nối sequelize

const Session = sequelize.define('Session', {
    sid: {
        type: DataTypes.STRING(36),
        primaryKey: true, // Đặt trường này làm khóa chính
        allowNull: false, // Không được để trống
    },
    expires: {
        type: DataTypes.DATE,
        allowNull: true, // Có thể để trống
    },
    data: {
        type: DataTypes.TEXT,
        allowNull: true, // Có thể để trống
    },

}, {
    tableName: 'Sessions', // Tên bảng trong cơ sở dữ liệu
    timestamps: false, // Tự động thêm createdAt và updatedAt
    underscored: true, // Sử dụng dấu gạch dưới cho các tên trường (sid, created_at, etc.)
});

// Để đồng bộ hóa mô hình với cơ sở dữ liệu, bạn có thể sử dụng:
// Session.sync(); // Chỉ sử dụng khi cần thiết, hãy cẩn thận với dữ liệu hiện có

module.exports = Session;
