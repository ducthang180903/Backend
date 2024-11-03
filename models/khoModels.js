const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Đảm bảo đường dẫn đúng tới file cấu hình của bạn
const SanPham = require('./productModel'); // Import mô hình SanPham

const Kho = sequelize.define('Kho', {
    KhoId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    SanPhamId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: SanPham, // Đặt mối quan hệ với mô hình SanPham
            key: 'SanPhamId',
        },
        onDelete: 'CASCADE', // Xóa kho khi sản phẩm bị xóa
    },
    SoLuong: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    DiaDiem: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    ThoiGianTao: {
        type: DataTypes.DATE, // Sử dụng DataTypes.DATE thay vì DataTypes.TIMESTAMP
        defaultValue: DataTypes.NOW, // Giữ nguyên giá trị mặc định
    },
}, {
    tableName: 'Kho', // Tên bảng trong cơ sở dữ liệu
    timestamps: false, // Không cần tự động thêm createdAt và updatedAt
});

// Định nghĩa mối quan hệ
Kho.belongsTo(SanPham, { foreignKey: 'SanPhamId' }); // Kho thuộc về SanPham

// Xuất mô hình để sử dụng trong các phần khác của ứng dụng
module.exports = Kho;
