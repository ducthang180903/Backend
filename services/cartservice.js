// services/cartService.js
const GioHang  = require('../models/cartModels');
const  ChiTietGioHang  = require('../models/chitietgiohangModels');
const SanPham  = require('../models/productModel');
const NguoiDung  = require('../models/userModel');

const { Op, Sequelize } = require('sequelize'); // Nhập Sequelize và Op từ sequelize



/// Lấy giỏ hàng dựa trên NguoiDungId
const getCart = async (NguoiDungId) => {
    return await GioHang.findOne({
        where: {
            NguoiDungId: NguoiDungId
        }
    });
};

// Tạo giỏ hàng mới
const createCart = async (NguoiDungId) => {
    return await GioHang.create({
        NguoiDungId: NguoiDungId,
        ThoiGianTao: new Date() // Hoặc có thể sử dụng một cách tạo thời gian khác
    });
};

// Lấy thông tin sản phẩm trong giỏ hàng
const getProductInCart = async (GioHangId, SanPhamId) => {
    return await ChiTietGioHang.findOne({
        where: {
            GioHangId: GioHangId,
            SanPhamId: SanPhamId
        }
    });
};

// Cập nhật số lượng sản phẩm trong giỏ hàng
const updateProductQuantity = async (GioHangId, SanPhamId, SoLuong) => {
    return await ChiTietGioHang.update(
        { SoLuong: Sequelize.literal(`SoLuong + ${SoLuong}`) },
        {
            where: {
                GioHangId: GioHangId,
                SanPhamId: SanPhamId
            }
        }
    );
};

// Thêm sản phẩm mới vào giỏ hàng
const addProductToCart = async (GioHangId, SanPhamId, SoLuong) => {
    return await ChiTietGioHang.create({
        GioHangId: GioHangId,
        SanPhamId: SanPhamId,
        SoLuong: SoLuong
    });
};

module.exports = {
    getCart,
    createCart,
    getProductInCart,
    updateProductQuantity,
    addProductToCart
};