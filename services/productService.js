const SanPham = require('../models/productModel'); // Nhập mô hình SanPham
const HinhAnhSanPham = require('../models/imgproductModel'); // Nhập mô hình HinhAnhSanPham
const LoaiSanPham = require('../models/producttypeModel'); // Nhập mô hình HinhAnhSanPham
const { Op } = require('sequelize');
const DonViTinh = require('../models/donViTinhModel');


// Hàm tạo sản phẩm
const createProduct = async (productData, hinhAnhFiles) => {
    const { TenSanPham, MoTa, Gia, SoLuongKho, LoaiSanPhamId, DonViTinhID  } = productData;
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
        Gia,
        SoLuongKho,
        LoaiSanPhamId,
        DonViTinhID,
    });
    // Thêm hình ảnh cho sản phẩm
    const hinhAnhPromises = hinhAnhFiles.map(file => {
        return HinhAnhSanPham.create({
SanPhamId: newProduct.SanPhamId,
            DuongDanHinh: file.path, // Lưu đường dẫn tệp hình ảnh
        });
    });
// Xử lý các promise để thêm tất cả hình ảnh
    await Promise.all(hinhAnhPromises);

    return { message: 'Sản phẩm đã được tạo thành công!', sanPhamId: newProduct.SanPhamId, status: 'success' };
};

const updateProduct = async (id, productData) => {
    const { TenSanPham, MoTa, Gia, SoLuongKho, LoaiSanPhamId,DonViTinhID, HinhAnh } = productData;

    // Kiểm tra xem tên sản phẩm đã tồn tại hay chưa
    const existingProduct = await SanPham.findOne({
        where: {
            TenSanPham,
            SanPhamId: { [Op.ne]: id }
        }
    });

    if (existingProduct) {
        return { warning: 'Tên sản phẩm đã tồn tại.', status: 201 };
    }

    // Cập nhật sản phẩm
    const [updatedRows] = await SanPham.update(
        {
            TenSanPham,
            MoTa,
            Gia,
            SoLuongKho,
            LoaiSanPhamId,
            DonViTinhID
        },
        { where: { SanPhamId: id } }
    );

    if (updatedRows === 0) {
        return { warning: 'Sản phẩm không tồn tại.', status: 201 };
    }

    // Xóa hình ảnh cũ và thêm hình ảnh mới
    await HinhAnhSanPham.destroy({ where: { SanPhamId: id } });

    if (HinhAnh && HinhAnh.length > 0) {
        const hinhAnhPromises = HinhAnh.map(image =>
            HinhAnhSanPham.create({
                SanPhamId: id,
                DuongDanHinh: image
            })
        );

        // Xử lý các promise để thêm tất cả hình ảnh mới
        await Promise.all(hinhAnhPromises);
    }

    return { message: 'Sản phẩm đã được cập nhật thành công!', status: 200 };
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
        }],
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
            HinhAnh: productData.HinhAnhSanPhams.map(image => `http://localhost:8000/${image.DuongDanHinh.replace(/\\/g, '/')}`), // Cập nhật đường dẫn hình ảnh
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
                HinhAnh: productData.HinhAnhSanPhams.map(image => `http://localhost:8000/${image.DuongDanHinh.replace(/\\/g, '/')}`), // Cập nhật đường dẫn hình ảnh
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
        }, {
            model: LoaiSanPham, // Thêm mô hình LoaiSanPham
            attributes: ['TenLoai'], // Chỉ lấy thuộc tính TenLoai
        }, {
            model: DonViTinh, // Thêm mô hình LoaiSanPham
            attributes: ['TenDonVi'], // Chỉ lấy thuộc tính TenLoai
        }],
    });

    if (!product) {
        throw new Error('Sản phẩm không tồn tại'); // Xử lý trường hợp sản phẩm không tồn tại
    }

    // Chuyển đổi dữ liệu thành cấu trúc mong muốn
    const productData = product.toJSON();
    return {
        SanPhamId: productData.SanPhamId,
        TenSanPham: productData.TenSanPham,
        MoTa: productData.MoTa,
        Gia: productData.Gia,
        SoLuongKho: productData.SoLuongKho,
        ThoiGianTao: productData.ThoiGianTao,
        ThoiGianCapNhat: productData.ThoiGianCapNhat,
        TenLoai: productData.LoaiSanPham ? productData.LoaiSanPham.TenLoai : null, // Lấy TenLoai từ mô hình LoaiSanPham
        TenDonVi: productData.DonViTinh  ? productData.DonViTinh.TenDonVi : null,
        // Chỉ hiển thị HinhAnh
        HinhAnh: productData.HinhAnhSanPhams.map(image => `http://localhost:8000/${image.DuongDanHinh.replace(/\\/g, '/')}`), // Cập nhật đường dẫn hình ảnh
    };
};









module.exports = { createProduct, updateProduct, deleteProduct, getAllProducts , getProductById , searchProductsByName };
