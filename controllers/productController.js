const pool = require('../config/database');
const HinhAnhSanPham = require('../models/imgproductModel');
const SanPham = require('../models/productModel');
const LoaiSanPham = require('../models/producttypeModel');
const productService = require('../services/productService');
const { Op } = require('sequelize');

// Hiển thị tất cả sản phẩm cùng với hình ảnh
const getproduct = async (req, res) => {
    try {
        const products = await productService.getAllProducts(); // Sử dụng hàm từ service
        res.status(200).json(products);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

// Thêm sản phẩm (cùng với hình ảnh)
const postproduct = async (req, res) => {
    const { TenSanPham, MoTa, Gia, SoLuongKho, LoaiSanPhamId } = req.body;
    // Nếu sử dụng single hình
    const HinhAnh = req.file ? [req.file.filename] : [];

    // Nếu sử dụng nhiều hình
    // const HinhAnh = req.files ? req.files.map(file => file.filename) : [];
    // console.log('check: ', HinhAnh);

    if (HinhAnh.length === 0) {
        return res.status(201).json({ warning: 'Vui lòng thêm hình ảnh.' });
    }

    try {
        const existingLoaiSanPham = await LoaiSanPham.findOne({ where: { LoaiSanPhamId } });
        const existingProduct = await SanPham.findOne({ where: { TenSanPham } });

        if (!existingLoaiSanPham) {
            return res.status(201).json({ warning: 'Loại sản phẩm không tồn tại.' });
        }

        if (existingProduct) {
            return res.status(201).json({ warning: 'Sản phẩm đã tồn tại.' });
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

        await Promise.all(hinhAnhPromises);

        return res.status(200).json({ message: 'Sản phẩm đã được tạo thành công!', newProduct });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Sửa sản phẩm
const putproduct = async (req, res) => {
    const { id } = req.params; // Lấy id từ params
    const { TenSanPham, MoTa, Gia, SoLuongKho, LoaiSanPhamId } = req.body;

    try {
        const existingLoaiSanPham = await LoaiSanPham.findOne({ where: { LoaiSanPhamId } });
        const existingProduct = await SanPham.findOne({
            where: {
                TenSanPham,
                SanPhamId: { [Op.ne]: id } // Kiểm tra sản phẩm khác với id hiện tại
            },
        });

        if (!existingLoaiSanPham) {
            return res.status(201).json({ warning: 'Loại sản phẩm không tồn tại.' });
        }

        if (existingProduct) {
            return res.status(201).json({ warning: 'Sản phẩm đã tồn tại.' });
        }

        const updateProduct = await SanPham.update(
            {
                TenSanPham,
                MoTa,
                Gia,
                SoLuongKho,
                LoaiSanPhamId
            },
            { where: { SanPhamId: id } }
        );

        return res.status(200).json({ message: 'Sản phẩm đã được cập nhật thành công!', updateProduct });

    } catch (error) {
        res.status(500).json({ error: error.message }); // Xử lý lỗi
    }
};

// Xóa sản phẩm
const deleteproduct = async (req, res) => {
    const { id } = req.params;

    try {
        const product = await SanPham.findByPk(id);

        if (!product) {
            return res.status(201).json({ warning: 'Sản phẩm không tồn tại.' });
        }
        await SanPham.destroy({ where: { SanPhamId: id } });

        res.status(200).json({ message: 'Sản phẩm đã được xóa thành công!' }); // Trả về phản hồi thành công
    } catch (error) {
        res.status(500).json({ error: error.message }); // Xử lý lỗi
    }
};

const deleteproducts = async (req, res) => {
    const data = req.body;

    if (!Array.isArray(data) || data.length === 0) {
        return res.status(201).json({ warning: "Danh sách sản phẩm không hợp lệ!" });
    }

    try {
        const deleteProduct = await SanPham.destroy({
            where: {
                SanPhamId: data
            }
        });

        if (deleteProduct === 0) {
            return res.status(201).json({ warning: "Không tìm thấy sản phẩm nào để xóa!" });
        }
        return res.status(200).json({ message: `Đã xóa thành công ${deleteProduct} sản phẩm.` });
    } catch (error) {
        res.status(500).json({ error: error.message }); // Xử lý lỗi
    }
};

module.exports = { getproduct, postproduct, putproduct, deleteproduct, deleteproducts };