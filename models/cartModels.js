const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Điều chỉnh đường dẫn đến tệp database của bạn

const GioHang = sequelize.define('GioHang', {
    GioHangId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    NguoiDungId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'NguoiDung',
            key: 'NguoiDungId',
        },
    },
    SessionId: {
        type: DataTypes.STRING(255),
        allowNull: true,
    },
    ThoiGianTao: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
}, {
    tableName: 'GioHang',
    timestamps: false,
});

// Mối quan hệ với NguoiDung
GioHang.associate = (models) => {
    GioHang.belongsTo(models.NguoiDung, {
        foreignKey: 'NguoiDungId',
        onDelete: 'CASCADE',
    });
    GioHang.hasMany(models.ChiTietGioHang, {
        foreignKey: 'GioHangId',
        onDelete: 'CASCADE',
    });
};

module.exports = GioHang;
