const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const TinTuc = require('../models/newsModel');

const HinhAnhTinTuc = sequelize.define('HinhAnhTinTuc', {
    HinhAnhId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    TinTucId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: TinTuc,
            key: 'TinTucId',
        },
    },
    DuongDanHinh: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
}, {
    tableName: 'HinhAnhTinTuc',
    timestamps: false,
});

// Thiết lập mối quan hệ với TinTuc
HinhAnhTinTuc.belongsTo(TinTuc, { foreignKey: 'TinTucId' });
TinTuc.hasMany(HinhAnhTinTuc, { foreignKey: 'TinTucId' });

module.exports = HinhAnhTinTuc;
