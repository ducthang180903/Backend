// services/cartService.js
const GioHang = require('../models/cartModels');
const ChiTietGioHang = require('../models/chitietgiohangModels');
const SanPham = require('../models/productModel');
const HinhAnhSanPham = require('../models/imgproductModel');
const Session = require('../models/sessionModels')
const { v4: uuidv4 } = require('uuid'); // Import uuid để tạo SessionId
const { Op, Sequelize } = require('sequelize'); // Nhập Sequelize và Op từ sequelize
const jwt = require('jsonwebtoken');
const DonViTinh = require('../models/donViTinhModel');
const ChiTietSanPham = require('../models/chitietsanphamModels');

const getCart = async (userId) => {
    // console.log('NguoiDungId:', userId); // Kiểm tra NguoiDungId

    try {
        const cart = await GioHang.findOne({
            where: { NguoiDungId: userId }
        });
        // console.log('check data: ', cart.GioHangId);

        if (!cart) {
            console.log('Giỏ hàng trống.');
            return {
                message: 'Giỏ hàng trống.',
                status: 'warning',
                cartDetails: [],
                totalQuantity: 0
            };
        }

        const cartDetails = await ChiTietGioHang.findAll({
            where: { GioHangId: cart.GioHangId },
            include: [
                {
                    model: SanPham,
                    attributes: ['SanPhamId', 'TenSanPham', 'MoTa', 'DonViTinhID'],
                    include: [
                        {
                            model: HinhAnhSanPham,
                            attributes: ['DuongDanHinh']
                        },
                        {
                            model: DonViTinh,
                            attributes: ['TenDonVi']
                        },
                        {
                            model: ChiTietSanPham,
                            attributes: ['LoaiChiTiet', 'Gia', 'SoLuong', 'ChiTietSanPhamId'] // Đảm bảo bạn lấy thêm ChiTietSanPhamId
                        }
                    ]
                }
            ]
        });
        // console.log('check data: ', cartDetails);

        // Tính tổng số lượng sản phẩm trong giỏ hàng
        const totalQuantity = cartDetails.reduce((total, item) => total + item.SoLuong, 0);

        const cartWithImages = cartDetails.map(item => {
            const productData = item.SanPham.toJSON();
            const images = productData.HinhAnhSanPhams.map(img => img.DuongDanHinh);

            // Lọc chi tiết sản phẩm theo ID đã chọn (ChitietSanPhamId)
            const selectedDetail = productData.ChiTietSanPhams.find(detail => detail.ChiTietSanPhamId === item.ChiTietSanPhamId);

            if (selectedDetail) {
                return {
                    SanPhamId: productData.SanPhamId,
                    TenSanPham: productData.TenSanPham,
                    Gia: {
                        ChiTietSanPhamId: selectedDetail.ChiTietSanPhamId,
                        LoaiChiTiet: selectedDetail.LoaiChiTiet,
                        Gia: selectedDetail.Gia,
                        SoLuong: selectedDetail.SoLuong
                    },
                    SoLuong: item.SoLuong,
                    TenDonVi: productData.DonViTinh ? productData.DonViTinh.TenDonVi : null,
                    DuongDanHinh: images
                };
            }

            return null; // Nếu không tìm thấy chi tiết sản phẩm đã chọn, trả về null
        }).filter(item => item !== null); // Loại bỏ những item null nếu không tìm thấy chi tiết

        return {
            cart: cartWithImages,
            totalQuantity // Trả về tổng số lượng sản phẩm
        };
    } catch (error) {
        console.error('Lỗi khi lấy giỏ hàng:', error);
        return {
            error: error.message,
            cartDetails: [],
            totalQuantity: 0
        };
    }
};

const addToCart = async (req, SanPhamId, SoLuong, ChiTietSanPhamId) => {
    // Kiểm tra xem SanPhamId và ChiTietSanPhamId đã được cung cấp chưa
    if (!SanPhamId || !ChiTietSanPhamId) {
        return { message: 'SanPhamId và ChiTietSanPhamId không được cung cấp.', status: 400 };
    }

    // Kiểm tra xem sản phẩm và chi tiết sản phẩm có tồn tại trong cơ sở dữ liệu không
    const existingProduct = await SanPham.findOne({ where: { SanPhamId } });
    if (!existingProduct) {
        return { message: 'Sản phẩm không tồn tại.', status: 404 };
    }

    const existingDetail = await ChiTietSanPham.findOne({ where: { ChiTietSanPhamId } });
    if (!existingDetail) {
        return { error: 'Vui lòng chọn chi tiết sản phẩm trước.', status: 201 };
    }

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
            return { message: 'Token không hợp lệ.', status: 401 };
        }
    }

    // Kiểm tra xem có `userId` hay không (đã đăng nhập)
    if (userId) {
        // Tìm giỏ hàng của người dùng đã đăng nhập
        const existingCart = await GioHang.findOne({ where: { NguoiDungId: userId } });

        if (existingCart) {
            // Kiểm tra xem ChiTietSanPhamId và SanPhamId đã có trong giỏ hàng chưa
            const existingProductInCart = await ChiTietGioHang.findOne({
                where: {
                    GioHangId: existingCart.GioHangId,
                    SanPhamId: SanPhamId,
                    ChiTietSanPhamId: ChiTietSanPhamId // Kiểm tra ChiTietSanPhamId trong giỏ hàng
                }
            });

            if (existingProductInCart) {
                // Cập nhật số lượng nếu sản phẩm đã có trong giỏ hàng
                existingProductInCart.SoLuong += SoLuong;
                await existingProductInCart.save();
                return { message: 'Sản phẩm đã được cập nhật trong giỏ hàng!', existingCartId: existingCart.GioHangId, SanPhamId, SoLuong, ChiTietSanPhamId, status: 'success' };
            } else {
                // Thêm sản phẩm mới vào giỏ hàng
                await ChiTietGioHang.create({
                    GioHangId: existingCart.GioHangId,
                    SanPhamId: SanPhamId,
                    SoLuong: SoLuong,
                    ChiTietSanPhamId: ChiTietSanPhamId
                });
                return { message: 'Đã Thêm Sản Phẩm vào giỏ hàng!', existingCartId: existingCart.GioHangId, SanPhamId, SoLuong, ChiTietSanPhamId, status: 'success' };
            }
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
                SoLuong: SoLuong,
                ChiTietSanPhamId: ChiTietSanPhamId
            });

            return { message: 'Giỏ hàng mới đã được tạo và sản phẩm đã được thêm!', newCartId: newCart.GioHangId, SanPhamId, SoLuong, ChiTietSanPhamId, status: 'success' };
        }
    } else {
        console.error('Người dùng chưa đăng nhập hoặc không có User ID.');
        return { message: 'Người dùng chưa đăng nhập.', status: 401 }; // Trả về thông báo người dùng chưa đăng nhập
    }
};

const deleteCartProduct = async (req, SanPhamId, ChiTietSanPhamId) => {
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
            // Xóa sản phẩm khỏi giỏ hàng dựa trên cả SanPhamId và ChiTietSanPhamId
            const deletedProduct = await ChiTietGioHang.destroy({
                where: {
                    GioHangId: existingCart.GioHangId,
                    SanPhamId: SanPhamId,
                    ChiTietSanPhamId: ChiTietSanPhamId // Thêm điều kiện ChiTietSanPhamId
                }
            });

            if (deletedProduct === 0) {
                return { message: 'Sản phẩm không tồn tại trong giỏ hàng hoặc chi tiết sản phẩm không hợp lệ.', status: 'warning' };
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

module.exports = {
    getCart,
    addToCart,
    deleteCartProduct
};