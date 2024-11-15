const pool = require('../config/database');
const path = require('path');
const fs = require('fs');
const HinhAnhSanPham = require('../models/imgproductModel');
const SanPham = require('../models/productModel');
const LoaiSanPham = require('../models/producttypeModel');
const DonViTinh = require('../models/donViTinhModel');
const productService = require('../services/productService');
const { Op } = require('sequelize');
const ChiTietGioHang = require('../models/chitietgiohangModels');
const ChiTietSanPham = require('../models/chitietsanphamModels');
const uploadPath = path.join(__dirname, 'uploads/imgs/');

// Hiển thị tất cả sản phẩm cùng với hình ảnh
const getproduct = async (req, res) => {
    try {
        const products = await productService.getAllProducts(); // Sử dụng hàm từ service
        res.status(200).json(products);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};
// Hiển thị sản phẩm theo SanPhamId
const getProductById = async (req, res) => {
    try {
        const { id } = req.params; // Lấy SanPhamId từ tham số URL
        const product = await productService.getProductById(id); // Gọi hàm từ service
        res.status(200).json(product); // Trả về dữ liệu sản phẩm
    } catch (error) {
        return res.status(404).json({ error: error.message }); // Trả lỗi nếu có
    }
};
// Thêm sản phẩm (cùng với hình ảnh)
const postproduct = async (req, res) => {
    const { TenSanPham, MoTa, LoaiSanPhamId, DonViTinhID, LoaiChiTiet, Gia, SoLuong } = req.body;
    // Nếu sử dụng single hình
    // const HinhAnh = req.file ? [req.file.filename] : [];
    // Nếu sử dụng nhiều hình
    const HinhAnh = req.files ? req.files.map(file => file.filename) : [];
    // console.log('check: ', HinhAnh);

    if (HinhAnh.length === 0) {
        return res.status(201).json({ warning: 'Vui lòng thêm hình ảnh.' });
    }

    try {
        const existingLoaiSanPham = await LoaiSanPham.findOne({ where: { LoaiSanPhamId } });
        const existingDonViTinh = await DonViTinh.findOne({ where: { DonViTinhID } });
        const existingProduct = await SanPham.findOne({ where: { TenSanPham } });

        if (!existingLoaiSanPham) {
            return res.status(201).json({ warning: 'Loại sản phẩm không tồn tại.' });
        }
        if (!existingDonViTinh) {
            return res.status(201).json({ warning: 'Đơn Vị Tính không tồn tại.' });
        }

        if (existingProduct) {
            return res.status(201).json({ warning: 'Sản phẩm đã tồn tại.' });
        }

        // Thêm sản phẩm
        const newProduct = await SanPham.create({
            TenSanPham,
            MoTa,
            LoaiSanPhamId,
            DonViTinhID
        });

        await ChiTietSanPham.create({
            SanPhamId: newProduct.SanPhamId,
            LoaiChiTiet,
            Gia,
            SoLuong
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

const deleteImageFile = (imagePath) => {
    try {
        if (fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath); // Xóa file ảnh
            console.log(`Đã xóa ảnh: ${imagePath}`);
        } else {
            console.log(`Ảnh không tồn tại: ${imagePath}`);
        }
    } catch (error) {
        console.error("Không thể xóa ảnh:", error.message);
    }
};

// Sửa sản phẩm
const putproduct = async (req, res) => {
    const { id } = req.params; // Lấy id từ params
    const { TenSanPham, MoTa, LoaiSanPhamId, DonViTinhID, ChiTietSanPhamId, LoaiChiTiet, Gia, SoLuong } = req.body;

    // return res.json(ChiTietSanPhamId);
    const HinhAnh = req.files ? req.files.map(file => file.filename) : [];
    if (HinhAnh.length === 0) {
        return res.status(201).json({ warning: 'Vui lòng thêm hình ảnh.' });
    }

    try {
        const existingLoaiSanPham = await LoaiSanPham.findOne({ where: { LoaiSanPhamId } });
        const existingDonViTinh = await DonViTinh.findOne({ where: { DonViTinhID } });
        const existingProduct = await SanPham.findOne({
            where: {
                TenSanPham,
                SanPhamId: { [Op.ne]: id } // Kiểm tra sản phẩm khác với id hiện tại
            },
        });

        if (!existingLoaiSanPham) {
            return res.status(201).json({ warning: 'Loại sản phẩm không tồn tại.' });
        }
        if (!existingDonViTinh) {
            return res.status(201).json({ warning: 'Đơn Vị Tính không tồn tại.' });
        }

        if (existingProduct) {
            return res.status(201).json({ warning: 'Sản phẩm đã tồn tại.' });
        }

        // Lấy các hình ảnh cũ trước khi xóa
        const oldImages = await HinhAnhSanPham.findAll({ where: { SanPhamId: id } });

        // Xóa các ảnh cũ khỏi cơ sở dữ liệu
        await HinhAnhSanPham.destroy({ where: { SanPhamId: id } });

        // Xóa các file hình ảnh cũ
        oldImages.forEach(image => {
            const imagePath = path.join(uploadPath, image.DuongDanHinh);
            deleteImageFile(imagePath);
        });

        // Cập nhật thông tin sản phẩm
        const newProduct = await SanPham.update(
            {
                TenSanPham,
                MoTa,
                LoaiSanPhamId,
                DonViTinhID
            },
            { where: { SanPhamId: id } }
        );

        await ChiTietSanPham.update(
            {
                LoaiChiTiet,
                Gia,
                SoLuong
            },
            { where: { ChiTietSanPhamId } }
        );

        // Thêm các hình ảnh mới
        const hinhAnhPromises = HinhAnh.map(image => {
            return HinhAnhSanPham.create({
                SanPhamId: id,
                DuongDanHinh: image,
            });
        });

        await Promise.all(hinhAnhPromises);
        return res.status(200).json({ message: 'Sản phẩm đã được cập nhật thành công!', newProduct });

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
        const images = await HinhAnhSanPham.findAll({ where: { SanPhamId: id } });

        // Xóa tất cả các file ảnh trong folder uploads/imgs/
        images.forEach(image => {
            const imagePath = path.join(uploadPath, image.DuongDanHinh);
            deleteImageFile(imagePath);
        });

        await ChiTietGioHang.destroy({ where: { ChiTietSanPhamId: { [Op.in]: await ChiTietSanPham.findAll({ where: { SanPhamId: id }, attributes: ['ChiTietSanPhamId'] }).then(details => details.map(detail => detail.ChiTietSanPhamId)) } } });
        await ChiTietSanPham.destroy({ where: { SanPhamId: id } });

        await HinhAnhSanPham.destroy({ where: { SanPhamId: id } });
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
        // Tìm tất cả ảnh liên quan đến sản phẩm
        const images = await HinhAnhSanPham.findAll({
            where: { SanPhamId: { [Op.in]: data } }
        });

        // Xóa file ảnh trên hệ thống
        images.forEach(image => {
            const imagePath = path.join(__dirname, '../uploads/imgs/', image.DuongDanHinh);
            deleteImageFile(imagePath);
        });

        // Xóa tất cả các ảnh liên quan trước
        await HinhAnhSanPham.destroy({
            where: { SanPhamId: { [Op.in]: data } }
        });
        await ChiTietGioHang.destroy({
            where: { ChiTietSanPhamId: { [Op.in]: await ChiTietSanPham.findAll({ where: { SanPhamId: { [Op.in]: data } }, attributes: ['ChiTietSanPhamId'] }).then(details => details.map(detail => detail.ChiTietSanPhamId)) } }
        }
        );
        await ChiTietSanPham.destroy({
            where: { SanPhamId: { [Op.in]: data } }
        });

        const deleteProduct = await SanPham.destroy({
            where: {
                SanPhamId: { [Op.in]: data } // Sử dụng Op.in để xóa nhiều sản phẩm
            }
        });

        if (deleteProduct === 0) {
            return res.status(201).json({ warning: "Sản phẩm không tồn tại." });
        }

        return res.status(200).json({ message: `Đã xóa thành công ${deleteProduct} sản phẩm.` });
    } catch (error) {
        res.status(500).json({ error: error.message }); // Xử lý lỗi
    }
};
const searchProducts = async (req, res) => {
    const { name, minPrice, maxPrice, loaiSanPhamId } = req.query; // Lấy tên, giá từ query string

    try {
        let products;

        // Điều kiện lấy tất cả sản phẩm nếu không có tham số nào được cung cấp
        if (!name && !minPrice && !maxPrice && !loaiSanPhamId) {
            products = await productService.getAllProducts(); // Gọi hàm lấy tất cả sản phẩm
        } else {
            // Khởi tạo một đối tượng chứa các điều kiện tìm kiếm
            const searchConditions = {
                name: name || '', // Tên sản phẩm, mặc định là chuỗi rỗng
                minPrice: minPrice ? parseFloat(minPrice) : null, // Giá tối thiểu
                maxPrice: maxPrice ? parseFloat(maxPrice) : null, // Giá tối đa
                loaiSanPhamId: loaiSanPhamId ? parseInt(loaiSanPhamId) : null // Loại sản phẩm ID
            };

            // Gọi hàm tìm kiếm từ service
            products = await productService.searchProductsByName(
                searchConditions.name,
                searchConditions.minPrice,
                searchConditions.maxPrice,
                searchConditions.loaiSanPhamId
            );
        }

        res.status(200).json(products); // Trả về danh sách sản phẩm
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};
module.exports = { getproduct, postproduct, putproduct, deleteproduct, deleteproducts, searchProducts, getProductById };