const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const TinTuc = sequelize.define('TinTuc', {
    TinTucId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    TieuDe: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    NoiDung: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    TacGia: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    NgayTao: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
    NgayCapNhat: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        onUpdate: DataTypes.NOW,
    },
}, {
    tableName: 'TinTuc',
    timestamps: false,
});
module.exports = TinTuc;
