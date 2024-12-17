const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const TinTuc = sequelize.define('TinTuc', {
    TinTucId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    TieuDe: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    MoTa: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    HinhAnh: {
        type: DataTypes.STRING(255), 
        allowNull: true,
        defaultValue: '',
    },
    Author: {
        type: DataTypes.STRING(100),
        allowNull: true,
        defaultValue: '',
    },
    CreatedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
    UpdatedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        onUpdate: DataTypes.NOW,
    },
}, {
    tableName: 'tintuc',
    timestamps: false,
});

module.exports = TinTuc;
