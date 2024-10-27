// services/cartService.js
const GioHang  = require('../models/cartModels');
const  ChiTietGioHang  = require('../models/chitietgiohangModels');
const SanPham  = require('../models/productModel');
const HinhAnhSanPham   = require('../models/imgproductModel');
const Session  = require('../models/sessionModels')
const { v4: uuidv4 } = require('uuid'); // Import uuid để tạo SessionId
const { Op, Sequelize } = require('sequelize'); // Nhập Sequelize và Op từ sequelize



/// Lấy giỏ hàng dựa trên NguoiDungId
const getCart = async (userId, SessionId) => {
    if (!userId && !SessionId) {
        throw new Error("SessionId không hợp lệ");
    }

    let cart;

    // Nếu có userId (người dùng đã đăng nhập), tìm giỏ hàng bằng NguoiDungId
    if (userId) {
        cart = await GioHang.findOne({
            where: { NguoiDungId: userId }
        });
    } 
    // Nếu không có userId, tìm giỏ hàng cho người dùng chưa đăng nhập bằng SessionId và lấy giỏ hàng mới nhất
    else if (SessionId) {
        cart = await GioHang.findOne({
            where: { SessionId: SessionId },
            order: [['ThoiGianTao', 'DESC']] // Lấy giỏ hàng mới nhất cho SessionId
        });
    }

    if (!cart) {
        return { message: 'Giỏ hàng trống.', status: 'warning', cartDetails: [] };
    }

    // Lấy chi tiết sản phẩm trong giỏ hàng
    const cartDetails = await ChiTietGioHang.findAll({
        where: { GioHangId: cart.GioHangId },
        include: [
            {
                model: SanPham,
                attributes: ['SanPhamId', 'TenSanPham', 'Gia', 'MoTa', 'SoLuongKho'],
                include: [
                    {
                        model: HinhAnhSanPham,
                        attributes: ['DuongDanHinh']
                    }
                ]
            }
        ]
    });

    // Xử lý dữ liệu chi tiết giỏ hàng
    const cartWithImages = cartDetails.map(item => {
        const sanPham = item.SanPham;
        const images = sanPham.HinhAnhSanPhams.map(img => img.DuongDanHinh);
        return {
            SanPhamId: sanPham.SanPhamId,
            TenSanPham: sanPham.TenSanPham,
            Gia: sanPham.Gia,
            MoTa: sanPham.MoTa,
            SoLuongKho: sanPham.SoLuongKho,
            SoLuong: item.SoLuong,
            DuongDanHinh: images
        };
    });

    return { 
        message: 'Giỏ hàng hiện tại của bạn:', 
        status: 'success', 
        cart: cartWithImages,
        NguoiDungId: cart.NguoiDungId,
        SessionId: cart.SessionId 
    };
};





const addToCart = async (SessionId, userId, SanPhamId, SoLuong) => {
    // Kiểm tra xem có `userId` hay không (đã đăng nhập)
    if (userId) {
        // Tìm giỏ hàng của người dùng đã đăng nhập
        const existingCart = await GioHang.findOne({ where: { NguoiDungId: userId } });

        if (existingCart) {
            // Nếu giỏ hàng đã tồn tại, thêm hoặc cập nhật sản phẩm trong giỏ hàng
            const existingProduct = await ChiTietGioHang.findOne({
                where: {
                    GioHangId: existingCart.GioHangId,
                    SanPhamId: SanPhamId
                }
            });

            if (existingProduct) {
                existingProduct.SoLuong += SoLuong;
                await existingProduct.save();
            } else {
                await ChiTietGioHang.create({
                    GioHangId: existingCart.GioHangId,
                    SanPhamId: SanPhamId,
                    SoLuong: SoLuong
                });
            }
            return { existingCartId: existingCart.GioHangId, SanPhamId, SoLuong };
        } else {
            // Tạo giỏ hàng mới cho người dùng đã đăng nhập
            const newCart = await GioHang.create({
                NguoiDungId: userId,
                ThoiGianTao: new Date()
            });

            await ChiTietGioHang.create({
                GioHangId: newCart.GioHangId,
                SanPhamId: SanPhamId,
                SoLuong: SoLuong
            });

            return { newCartId: newCart.GioHangId, SanPhamId, SoLuong };
        }
    } else {
        // Kiểm tra `SessionId` cho người dùng chưa đăng nhập
        if (!SessionId) {
            // Nếu không có SessionId, tạo mới
            SessionId = uuidv4(); // Tạo một SessionId mới
// Đặt thời gian hết hạn là 10 phút (600000 ms)
const expires = new Date(Date.now() + 10 * 60 * 1000);
            // Lưu SessionId vào bảng Sessions
            await Session.create({
                sid: SessionId,
                expires: expires, // Bạn có thể đặt thời gian hết hạn nếu cần
                data: JSON.stringify({}), // Dữ liệu session, nếu cần
                createdAt: new Date(),
                updatedAt: new Date()
            });

            console.log("SessionId mới được tạo:", SessionId);
        }

        const existingCart = await GioHang.findOne({ where: { SessionId } });

        if (existingCart) {
            const existingProduct = await ChiTietGioHang.findOne({
                where: {
                    GioHangId: existingCart.GioHangId,
                    SanPhamId: SanPhamId
                }
            });

            if (existingProduct) {
                existingProduct.SoLuong += SoLuong;
                await existingProduct.save();
            } else {
                await ChiTietGioHang.create({
                    GioHangId: existingCart.GioHangId,
                    SanPhamId: SanPhamId,
                    SoLuong: SoLuong
                });
            }
            return { existingCartId: existingCart.GioHangId, SanPhamId, SoLuong };
        } else {
            // Tạo giỏ hàng mới cho người dùng chưa đăng nhập
            const newCart = await GioHang.create({
                SessionId,
                ThoiGianTao: new Date()
            });

            await ChiTietGioHang.create({
                GioHangId: newCart.GioHangId,
                SanPhamId: SanPhamId,
                SoLuong: SoLuong
            });

            return { newCartId: newCart.GioHangId, SanPhamId, SoLuong };
        }
    }
};

// services/cartService.js
const deleteCartProduct = async (sanPhamId, nguoiDungId) => {
    // Kiểm tra xem các tham số có hợp lệ không
    if (!sanPhamId) {
        throw new Error('SanPhamId không hợp lệ.');
    }
    
    // Kiểm tra xem nguoiDungId có hợp lệ không
    if (!nguoiDungId) {
        throw new Error('NguoiDungId không hợp lệ.');
    }

    // Kiểm tra tồn tại giỏ hàng dựa trên NguoiDungId
    console.log('Checking for cart with NguoiDungId:', nguoiDungId);

    const cart = await GioHang.findOne({
        where: {
            NguoiDungId: nguoiDungId // Tìm giỏ hàng theo NguoiDungId
        }
    });

    // Log kết quả tìm kiếm giỏ hàng
    console.log('Found cart:', cart);

    if (!cart) {
        throw new Error('Giỏ hàng không tồn tại.');
    }

    const GioHangId = cart.GioHangId; // Lấy GioHangId từ giỏ hàng
    console.log('GioHangId:', GioHangId);

    // Xóa sản phẩm khỏi ChiTietGioHang
    const deletedProduct = await ChiTietGioHang.destroy({
        where: {
            GioHangId: GioHangId,
            SanPhamId: sanPhamId // Kiểm tra sản phẩm theo sanPhamId
        }
    });

    console.log('Deleted product count:', deletedProduct); // Log số lượng sản phẩm đã xóa

    if (deletedProduct === 0) { // Kiểm tra xem có sản phẩm nào bị xóa không
        throw new Error('Sản phẩm không tồn tại trong giỏ hàng.');
    }

    return { message: 'Sản phẩm đã được xóa khỏi giỏ hàng.', deletedProduct };
};











// Cập nhật số lượng sản phẩm trong giỏ hàng


// Thêm sản phẩm mới vào giỏ hàng


module.exports = {
    getCart,
    addToCart,
    deleteCartProduct
};