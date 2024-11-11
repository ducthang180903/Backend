const SanPham = require('../models/productModel'); // Nhập mô hình SanPham
const HinhAnhSanPham = require('../models/imgproductModel'); // Nhập mô hình HinhAnhSanPham
const LoaiSanPham = require('../models/producttypeModel'); // Nhập mô hình HinhAnhSanPham
const { Op } = require('sequelize');
const DonViTinh = require('../models/donViTinhModel');
const ChiTietSanPham = require('../models/chitietsanphamModels');
const createProduct = async (productData) => {
    const { TenSanPham, MoTa, LoaiSanPhamId, DonViTinhID, LoaiChiTiet, Gia, SoLuong, HinhAnh } = productData;

    // Kiểm tra xem loại sản phẩm đã tồn tại hay chưa
    const existingLoaiSanPham = await LoaiSanPham.findOne({ where: { LoaiSanPhamId } });
    if (!existingLoaiSanPham) {
        return { warning: 'Loại sản phẩm không tồn tại.', status: 201, sanPhamId: null };
    }
    // Kiểm tra xem Donvitinh đã tồn tại hay chưa
    const existingDonViTinh = await DonViTinh.findOne({ where: { DonViTinhID } });
    if (!existingDonViTinh) {
        return { warning: 'Đơn Vị Tính không tồn tại.', status: 201, sanPhamId: null };
    }
    // Kiểm tra xem sản phẩm đã tồn tại hay chưa
    const existingProduct = await SanPham.findOne({ where: { TenSanPham } });
    if (existingProduct) {
        return { warning: 'Sản phẩm đã tồn tại.', status: 201, sanPhamId: null };
    }

    // Thêm sản phẩm
    const newProduct = await SanPham.create({
        TenSanPham,
        MoTa,
        LoaiSanPhamId,
        DonViTinhID,
    });

    await ChiTietSanPham.create({
        SanPhamId: newProduct.SanPhamId,
        LoaiChiTiet,
        Gia,
        SoLuong,
    });

    // Thêm hình ảnh cho sản phẩm
    const hinhAnhPromises = HinhAnh.map(image => {
        return HinhAnhSanPham.create({
            SanPhamId: newProduct.SanPhamId,
            DuongDanHinh: image,
        });
    });

    // Xử lý các promise để thêm tất cả hình ảnh
    await Promise.all(hinhAnhPromises);

    return { message: 'Sản phẩm đã được tạo thành công!', sanPhamId: newProduct.SanPhamId, status: 'success' };
};


// xóa sản phẩm
const deleteProduct = async (productId) => {
    // Kiểm tra sản phẩm có tồn tại không
    const product = await SanPham.findByPk(productId);
    if (!product) {
        return { message: 'Sản phẩm không tồn tại.', status: 'warning' };
    }

    // Xóa hình ảnh liên quan
    await HinhAnhSanPham.destroy({ where: { SanPhamId: productId } });

    // Xóa sản phẩm
    await SanPham.destroy({ where: { SanPhamId: productId } });

    return { message: 'Sản phẩm đã được xóa thành công!', status: 'success' };
};

const getAllProducts = async () => {
    const products = await SanPham.findAll({
        include: [{
            model: HinhAnhSanPham,
            attributes: ['DuongDanHinh'], // Chỉ lấy đường dẫn hình ảnh
        }, {
            model: ChiTietSanPham, // Thêm chi tiết sản phẩm vào truy vấn
            attributes: ['ChiTietSanPhamId', 'LoaiChiTiet', 'Gia', 'SoLuong'], // Chỉ lấy loại chi tiết, giá và số lượng
        },
        {
            model: DonViTinh, // Thêm DonViTinh vào truy vấn
            attributes: ['DonViTinhID', 'TenDonVi'], // Chỉ lấy DonViTinhID và TenDonVi
        }
        ],
    });

    // return products;
    // Chuyển đổi dữ liệu thành cấu trúc mong muốn
    return products.map(product => {
        const productData = product.toJSON();
        const sortedDetails = Array.isArray(productData.ChiTietSanPhams)
            ? productData.ChiTietSanPhams.sort((a, b) => a.ChiTietSanPhamId - b.ChiTietSanPhamId)
            : []; // Nếu không có, trả về mảng rỗng
        return {
            // Chỉ lấy các thuộc tính cần thiết của sản phẩm
            SanPhamId: productData.SanPhamId,
            TenSanPham: productData.TenSanPham,
            MoTa: productData.MoTa,
            PhanLoai: sortedDetails.map(detail => ({
                ChiTietSanPhamId: detail.ChiTietSanPhamId,
                LoaiChiTiet: detail.LoaiChiTiet,
                Gia: detail.Gia,
                SoLuong: detail.SoLuong,
            })),
            ThoiGianTao: productData.ThoiGianTao,
            ThoiGianCapNhat: productData.ThoiGianCapNhat,
            LoaiSanPhamId: productData.LoaiSanPhamId,
            DonViTinhID: productData.DonViTinhID,
            // Chỉ hiển thị HinhAnh
            HinhAnh: productData.HinhAnhSanPhams
        };
    });
};

const searchProductsByName = async (name, minPrice, maxPrice, loaiSanPhamId) => {
    try {
        // Khởi tạo một object để chứa các điều kiện tìm kiếm
        const whereConditions = {};

        // Nếu có tên sản phẩm, thêm điều kiện tìm kiếm theo tên
        if (name) {
            whereConditions.TenSanPham = {
                [Op.like]: `%${name}%` // Tìm kiếm với điều kiện LIKE
            };
        }

        // Nếu có giá tối thiểu, thêm vào điều kiện
        if (minPrice) {
            whereConditions.Gia = { [Op.gte]: minPrice }; // Giá lớn hơn hoặc bằng minPrice
        }

        // Nếu có giá tối đa, thêm vào điều kiện
        if (maxPrice) {
            whereConditions.Gia = { ...whereConditions.Gia, [Op.lte]: maxPrice }; // Giá nhỏ hơn hoặc bằng maxPrice
        }

        // Nếu có loại sản phẩm ID, thêm vào điều kiện
        if (loaiSanPhamId) {
            whereConditions.LoaiSanPhamId = loaiSanPhamId; // Thêm điều kiện tìm theo loại sản phẩm
        }

        // Tìm kiếm sản phẩm với các điều kiện
        const products = await SanPham.findAll({
            where: whereConditions,
            include: [
                {
                    model: HinhAnhSanPham,
                    attributes: ['DuongDanHinh'], // Chỉ lấy đường dẫn hình ảnh
                },
                {
                    model: LoaiSanPham,
                    attributes: [], // Không lấy thuộc tính nào từ loại sản phẩm
                }
            ],
        });

        return products.map(product => {
            const productData = product.toJSON();
            return {
                SanPhamId: productData.SanPhamId,
                TenSanPham: productData.TenSanPham,
                MoTa: productData.MoTa,
                Gia: productData.Gia,
                SoLuongKho: productData.SoLuongKho,
                ThoiGianTao: productData.ThoiGianTao,
                ThoiGianCapNhat: productData.ThoiGianCapNhat,
                LoaiSanPhamId: productData.LoaiSanPhamId,
                DonViTinhID: productData.DonViTinhID,
                HinhAnh: productData.HinhAnhSanPhams.map(image => `http://localhost:8000/api/${image.DuongDanHinh.replace(/\\/g, '/')}`), // Cập nhật đường dẫn hình ảnh
            };
        });
    } catch (error) {
        throw new Error('Có lỗi xảy ra khi tìm kiếm sản phẩm: ' + error.message);
    }
};
// hiển thị theo ID
const getProductById = async (sanPhamId) => {
    const product = await SanPham.findOne({
        where: { SanPhamId: sanPhamId }, // Lọc sản phẩm theo SanPhamId
        include: [{
            model: HinhAnhSanPham,
            attributes: ['DuongDanHinh'], // Chỉ lấy đường dẫn hình ảnh
        },
        {
            model: LoaiSanPham, // Thêm mô hình LoaiSanPham
            attributes: ['TenLoai'], // Chỉ lấy thuộc tính TenLoai
        },
        {
            model: ChiTietSanPham, // Thêm chi tiết sản phẩm vào truy vấn
            attributes: ['ChiTietSanPhamId', 'LoaiChiTiet', 'Gia', 'SoLuong'], // Chỉ lấy loại chi tiết, giá và số lượng
        },
        {
            model: DonViTinh, // Thêm mô hình LoaiSanPham
            attributes: ['TenDonVi'], // Chỉ lấy thuộc tính TenLoai
        }],
    });
    // return product

    if (!product) {
        throw new Error('Sản phẩm không tồn tại'); // Xử lý trường hợp sản phẩm không tồn tại
    }

    // Chuyển đổi dữ liệu thành cấu trúc mong muốn
    const productData = product.toJSON();


    // Kiểm tra xem ChiTietSanPhams có tồn tại không và là một mảng
    const sortedDetails = Array.isArray(productData.ChiTietSanPhams)
        ? productData.ChiTietSanPhams.sort((a, b) => a.ChiTietSanPhamId - b.ChiTietSanPhamId)
        : []; // Nếu không có, trả về mảng rỗng

    return {
        SanPhamId: productData.SanPhamId,
        TenSanPham: productData.TenSanPham,
        MoTa: productData.MoTa,
        Gia: sortedDetails.map(detail => ({
            ChiTietSanPhamId: detail.ChiTietSanPhamId,
            LoaiChiTiet: detail.LoaiChiTiet,
            Gia: detail.Gia,
            SoLuong: detail.SoLuong,
        })),
        ThoiGianTao: productData.ThoiGianTao,
        ThoiGianCapNhat: productData.ThoiGianCapNhat,
        TenLoai: productData.LoaiSanPham ? productData.LoaiSanPham.TenLoai : null, // Lấy TenLoai từ mô hình LoaiSanPham
        TenDonVi: productData.DonViTinh ? productData.DonViTinh.TenDonVi : null,
        HinhAnh: productData.HinhAnhSanPhams
    };
};


module.exports = { createProduct, deleteProduct, getAllProducts, searchProductsByName, getProductById };
