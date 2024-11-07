const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Đảm bảo đường dẫn đúng tới tệp cấu hình cơ sở dữ liệu
const LoaiSanPham = require('./producttypeModel');
const DonViTinh = require('./donViTinhModel');
const ChiTietSanPham = require('./chitietsanphamModels');


const SanPham = sequelize.define('SanPham', {
    SanPhamId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    TenSanPham: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    MoTa: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    ThoiGianTao: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
    ThoiGianCapNhat: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        onUpdate: DataTypes.NOW,
    },
    LoaiSanPhamId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'LoaiSanPham', // Tên bảng loại sản phẩm
            key: 'LoaiSanPhamId',
        },
    },
    DonViTinhID:{
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'DonViTinh', // Tên bảng loại sản phẩm
            key: 'DonViTinhID',
        },
    }
}, {
    tableName: 'SanPham', // Đảm bảo tên bảng đúng
    timestamps: false, // Tùy chọn nếu không muốn sử dụng timestamps tự động
});
SanPham.belongsTo(LoaiSanPham, { foreignKey: 'LoaiSanPhamId' });
SanPham.belongsTo(DonViTinh, { foreignKey: 'DonViTinhID' });
// SanPham.hasMany(ChiTietSanPham, { foreignKey: 'SanPhamId' });
// Thiết lập mối quan hệ chỉ sử dụng belongsTo

// SanPham.belongsTo(HinhAnhSanPham, { foreignKey: 'SanPhamId', onDelete: 'CASCADE' }); // Nếu cần thiết
// SanPham.belongsTo(Kho, { foreignKey: 'SanPhamId', as: 'kho', onDelete: 'CASCADE' }); // Nếu cần thiết

// Xuất mô hình để sử dụng ở nơi khác
// Mối quan hệ với LoaiSanPham
// SanPham.associate = (models) => {
//     SanPham.belongsTo(models.ChiTietSanPham, {
//         foreignKey: 'SanPhamId',
//         onDelete: 'CASCADE',
//     });
//     SanPham.belongsTo(models.LoaiSanPham, {
//         foreignKey: 'LoaiSanPhamId',
//         onDelete: 'CASCADE',
//     });
//     SanPham.belongsTo(models.DonViTinh, {
//         foreignKey: 'DonViTinhID',
//         onDelete: 'CASCADE',
//     });
//     SanPham.hasMany(models.HinhAnhSanPham, {
//         foreignKey: 'SanPhamId',
//         onDelete: 'CASCADE',
//     });
 
//     SanPham.hasMany(models.ChiTietDonHangDaDangNhap, {
//         foreignKey: 'SanPhamId',
//         onDelete: 'CASCADE',
//     });
//     SanPham.hasMany(models.ChiTietDonHangKhongDangNhap, {
//         foreignKey: 'SanPhamId',
//         onDelete: 'CASCADE',
//     });
//     // Định nghĩa mối quan hệ
// SanPham.hasMany(models.Kho, {
//     foreignKey: 'SanPhamId', // Khóa ngoại
//     as: 'kho', // Alias cho mối quan hệ
// });


// };
module.exports = SanPham;
