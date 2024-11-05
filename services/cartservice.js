// services/cartService.js
const GioHang  = require('../models/cartModels');
const  ChiTietGioHang  = require('../models/chitietgiohangModels');
const SanPham  = require('../models/productModel');
const HinhAnhSanPham   = require('../models/imgproductModel');
const Session  = require('../models/sessionModels')
const { v4: uuidv4 } = require('uuid'); // Import uuid để tạo SessionId
const { Op, Sequelize } = require('sequelize'); // Nhập Sequelize và Op từ sequelize
const jwt = require('jsonwebtoken');
const DonViTinh = require('../models/donViTinhModel');


/// Lấy giỏ hàng dựa trên NguoiDungId
const getCart = async (userId) => {
    console.log('NguoiDungId:', userId); // Kiểm tra NguoiDungId

    try {
        const cart = await GioHang.findOne({
            where: { NguoiDungId: userId }
        });

        if (!cart) {
            console.log('Giỏ hàng trống.');
            return {
                message: 'Giỏ hàng trống.',
                status: 'warning',
                cartDetails: [],
                totalQuantity: 0 // Trả về số lượng sản phẩm là 0
            };
        }

        const cartDetails = await ChiTietGioHang.findAll({
            where: { GioHangId: cart.GioHangId },
            include: [
                {
                    model: SanPham,
                    attributes: ['SanPhamId', 'TenSanPham', 'Gia', 'MoTa', 'SoLuongKho','DonViTinhID'],
                    include: [
                        {
                            model: HinhAnhSanPham,
                            attributes: ['DuongDanHinh']
                        },
                        {
                            model: DonViTinh, // Thêm mô hình LoaiSanPham
                            attributes: ['TenDonVi'], // Chỉ lấy thuộc tính TenLoai
                        }
                    ],
                }
            ]
        });

        // Tính tổng số lượng sản phẩm trong giỏ hàng
        const totalQuantity = cartDetails.reduce((total, item) => total + item.SoLuong, 0);

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
                TenDonVi: sanPham.DonViTinh  ? sanPham.DonViTinh.TenDonVi : null,
                DuongDanHinh: images
            };
        });

        return { 
            message: 'Giỏ hàng hiện tại của bạn:', 
            status: 'success', 
            cart: cartWithImages,
            totalQuantity // Trả về tổng số lượng sản phẩm
        };
    } catch (error) {
        console.error('Lỗi khi lấy giỏ hàng:', error);
        return { // Đảm bảo trả về đối tượng mặc định khi có lỗi
            message: 'Có lỗi xảy ra khi lấy giỏ hàng.',
            status: 'error',
            cartDetails: [],
            totalQuantity: 0 // Trả về số lượng sản phẩm là 0 trong trường hợp có lỗi
        };
    }
};















// const addToCart = async (SessionId, userId, SanPhamId, SoLuong) => {

//     // Kiểm tra xem có `userId` hay không (đã đăng nhập)
//     if (userId) {
//         // Tìm giỏ hàng của người dùng đã đăng nhập
//         const existingCart = await GioHang.findOne({ where: { NguoiDungId: userId } });

//         if (existingCart) {
//             // Nếu giỏ hàng đã tồn tại, thêm hoặc cập nhật sản phẩm trong giỏ hàng
//             const existingProduct = await ChiTietGioHang.findOne({
//                 where: {
//                     GioHangId: existingCart.GioHangId,
//                     SanPhamId: SanPhamId
//                 }
//             });

//             if (existingProduct) {
//                 existingProduct.SoLuong += SoLuong;
//                 await existingProduct.save();
//             } else {
//                 await ChiTietGioHang.create({
//                     GioHangId: existingCart.GioHangId,
//                     SanPhamId: SanPhamId,
//                     SoLuong: SoLuong
//                 });
//             }
//             return { existingCartId: existingCart.GioHangId, SanPhamId, SoLuong };
//         } else {
//             // Tạo giỏ hàng mới cho người dùng đã đăng nhập
//             const newCart = await GioHang.create({
//                 NguoiDungId: userId,
//                 ThoiGianTao: new Date()
//             });

//             await ChiTietGioHang.create({
//                 GioHangId: newCart.GioHangId,
//                 SanPhamId: SanPhamId,
//                 SoLuong: SoLuong
//             });

//             return { newCartId: newCart.GioHangId, SanPhamId, SoLuong };
//         }
//     } else {
//         // Kiểm tra `SessionId` cho người dùng chưa đăng nhập
//         if (!SessionId) {
//             // Nếu không có SessionId, tạo mới
//             SessionId = uuidv4(); // Tạo một SessionId mới
// // Đặt thời gian hết hạn là 10 phút (600000 ms)
// const expires = new Date(Date.now() + 10 * 60 * 1000);
//             // Lưu SessionId vào bảng Sessions
//             await Session.create({
//                 sid: SessionId,
//                 expires: expires, // Bạn có thể đặt thời gian hết hạn nếu cần
//                 data: JSON.stringify({}), // Dữ liệu session, nếu cần
//                 createdAt: new Date(),
//                 updatedAt: new Date()
//             });

//             console.log("SessionId mới được tạo:", SessionId);
//         }

//         const existingCart = await GioHang.findOne({ where: { SessionId } });

//         if (existingCart) {
//             const existingProduct = await ChiTietGioHang.findOne({
//                 where: {
//                     GioHangId: existingCart.GioHangId,
//                     SanPhamId: SanPhamId
//                 }
//             });

//             if (existingProduct) {
//                 existingProduct.SoLuong += SoLuong;
//                 await existingProduct.save();
//             } else {
//                 await ChiTietGioHang.create({
//                     GioHangId: existingCart.GioHangId,
//                     SanPhamId: SanPhamId,
//                     SoLuong: SoLuong
//                 });
//             }
//             return { existingCartId: existingCart.GioHangId, SanPhamId, SoLuong };
//         } else {
//             // Tạo giỏ hàng mới cho người dùng chưa đăng nhập
//             const newCart = await GioHang.create({
//                 SessionId,
//                 ThoiGianTao: new Date()
//             });

//             await ChiTietGioHang.create({
//                 GioHangId: newCart.GioHangId,
//                 SanPhamId: SanPhamId,
//                 SoLuong: SoLuong
//             });

//             return { newCartId: newCart.GioHangId, SanPhamId, SoLuong };
//         }
//     }
// };

// services/cartService.js



const addToCart = async (req, SanPhamId, SoLuong) => {
    // Lấy token từ cookie
    const token = req.cookies.ss_account;

    let userId = null;

    if (token) {
        try {
            // Giải mã token để lấy thông tin người dùng
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            userId = decoded.id; // Lấy NguoiDungId từ token
        } catch (error) {
            console.error('Token không hợp lệ:', error);
            return null; // Trả về null hoặc xử lý lỗi tùy ý
        }
    }

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
                // Cập nhật số lượng nếu sản phẩm đã có trong giỏ hàng
                existingProduct.SoLuong += SoLuong;
                await existingProduct.save();
            } else {
                // Thêm sản phẩm mới vào giỏ hàng
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

            // Thêm sản phẩm vào giỏ hàng mới
            await ChiTietGioHang.create({
                GioHangId: newCart.GioHangId,
                SanPhamId: SanPhamId,
                SoLuong: SoLuong
            });

            return { newCartId: newCart.GioHangId, SanPhamId, SoLuong };
        }
    } else {
        console.error('Người dùng chưa đăng nhập hoặc không có User ID.');
        return null; // Trả về null hoặc xử lý lỗi tùy ý
    }
};


// const deleteCartProduct = async (sanPhamId) => {
//     // Kiểm tra xem sanPhamId có hợp lệ không
//     if (!sanPhamId) {
//         throw new Error('SanPhamId không hợp lệ.');
//     }

//     // Xóa sản phẩm khỏi ChiTietGioHang bằng sanPhamId
//     const deletedProduct = await ChiTietGioHang.destroy({
//         where: {
//             SanPhamId: sanPhamId // Kiểm tra sản phẩm theo sanPhamId
//         }
//     });

//     console.log('Deleted product count:', deletedProduct); // Log số lượng sản phẩm đã xóa

//     if (deletedProduct === 0) { // Kiểm tra xem có sản phẩm nào bị xóa không
//         throw new Error('Sản phẩm không tồn tại trong giỏ hàng.');
//     }

//     return { message: 'Sản phẩm đã được xóa khỏi giỏ hàng.', deletedProduct };
// };

const deleteCartProduct = async (req, SanPhamId) => {
    // Lấy token từ cookie
    const token = req.cookies.ss_account;

    let userId = null;

    if (token) {
        try {
            // Giải mã token để lấy thông tin người dùng
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            userId = decoded.id; // Lấy NguoiDungId từ token
        } catch (error) {
            console.error('Token không hợp lệ:', error);
            return { message: 'Token không hợp lệ', status: 'error' };
        }
    }

    // Kiểm tra xem có `userId` hay không (người dùng đã đăng nhập)
    if (userId) {
        // Tìm giỏ hàng của người dùng
        const existingCart = await GioHang.findOne({ where: { NguoiDungId: userId } });

        if (existingCart) {
            // Xóa sản phẩm khỏi giỏ hàng
            const deletedProduct = await ChiTietGioHang.destroy({
                where: {
                    GioHangId: existingCart.GioHangId,
                    SanPhamId: SanPhamId
                }
            });

            if (deletedProduct === 0) {
                return { message: 'Sản phẩm không tồn tại trong giỏ hàng.', status: 'warning' };
            }

            return { message: 'Sản phẩm đã được xóa khỏi giỏ hàng.', status: 'success' };
        } else {
            return { message: 'Giỏ hàng của người dùng không tồn tại.', status: 'warning' };
        }
    } else {
        console.error('Người dùng chưa đăng nhập hoặc không có User ID.');
        return { message: 'Người dùng chưa đăng nhập.', status: 'error' };
    }
};













// Cập nhật số lượng sản phẩm trong giỏ hàng


// Thêm sản phẩm mới vào giỏ hàng


module.exports = {
    getCart,
    addToCart,
    deleteCartProduct
};