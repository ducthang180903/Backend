const SanPham = require('../models/productModel'); // Nhập mô hình SanPham
const HinhAnhSanPham = require('../models/imgproductModel'); // Nhập mô hình HinhAnhSanPham
const LoaiSanPham = require('../models/producttypeModel'); // Nhập mô hình HinhAnhSanPham
const { Op } = require('sequelize');


const createProduct = async (productData) => {
    const { TenSanPham, MoTa, Gia, SoLuongKho, LoaiSanPhamId, HinhAnh } = productData;

    // Kiểm tra xem loại sản phẩm đã tồn tại hay chưa
    const existingLoaiSanPham = await LoaiSanPham.findOne({ where: { LoaiSanPhamId } });
    if (!existingLoaiSanPham) {
        return { message: 'Loại sản phẩm không tồn tại.', status: 'warning', sanPhamId: null };
    }

    // Kiểm tra xem sản phẩm đã tồn tại hay chưa
    const existingProduct = await SanPham.findOne({ where: { TenSanPham } });
    if (existingProduct) {
        return { message: 'Sản phẩm đã tồn tại.', status: 'warning', sanPhamId: null };
    }

    // Thêm sản phẩm
    const newProduct = await SanPham.create({
        TenSanPham,
        MoTa,
        Gia,
        SoLuongKho,
        LoaiSanPhamId,
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

const updateProduct = async (id, productData) => {
    const { TenSanPham, MoTa, Gia, SoLuongKho, LoaiSanPhamId, HinhAnh } = productData;

    // Kiểm tra xem tên sản phẩm đã tồn tại hay chưa
    const existingProduct = await SanPham.findOne({
        where: {
            TenSanPham,
            SanPhamId: { [Op.ne]: id }
        }
    });

    if (existingProduct) {
        return { message: 'Tên sản phẩm đã tồn tại.', status: 'warning' };
    }

    // Cập nhật sản phẩm
    const [updatedRows] = await SanPham.update(
        {
            TenSanPham,
            MoTa,
            Gia,
            SoLuongKho,
            LoaiSanPhamId
        },
        { where: { SanPhamId: id } }
    );

    if (updatedRows === 0) {
        return { message: 'Sản phẩm không tồn tại.', status: 'error' };
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

    return { message: 'Sản phẩm đã được cập nhật thành công!', status: 'success' };
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

    // Chuyển đổi dữ liệu thành cấu trúc mong muốn
    return products.map(product => {
        const productData = product.toJSON();
        return {
            // Chỉ lấy các thuộc tính cần thiết của sản phẩm
            SanPhamId: productData.SanPhamId,
            TenSanPham: productData.TenSanPham,
            MoTa: productData.MoTa,
            Gia: productData.Gia,
            SoLuongKho: productData.SoLuongKho,
            ThoiGianTao: productData.ThoiGianTao,
            ThoiGianCapNhat: productData.ThoiGianCapNhat,
            LoaiSanPhamId: productData.LoaiSanPhamId,
            // Chỉ hiển thị HinhAnh
            HinhAnh: productData.HinhAnhSanPhams.map(image => image.DuongDanHinh), // Chuyển hình ảnh thành mảng
        };
    });
};





module.exports = { createProduct , updateProduct , deleteProduct, getAllProducts };
