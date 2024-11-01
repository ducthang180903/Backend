const LoaiSanPham = require('../models/producttypeModel');
const { Op } = require('sequelize');
const { createProductCategory, getAllProductTypes, updateProductType, deleteProductType } = require('../services/producttypeService');

// Lấy tất cả loại sản phẩm
const getproducttype = async (req, res) => {
    try {
        const productTypes = await getAllProductTypes();
        res.status(200).json(productTypes);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Thêm loại sản phẩm
const postproducttype = async (req, res) => {
    const { TenLoai } = req.body;
    if (!TenLoai) {
        return res.status(201).json({ warning: 'Vui lòng nhập loại sản phẩm.' });
    };

    try {
        const existingCategory = await LoaiSanPham.findOne({
            where: { TenLoai }
        });
        if (existingCategory) {
            return res.status(201).json({ warning: 'Tên loại sản phẩm đã tồn tại.' });
        }
        // Nếu không tồn tại, thêm loại sản phẩm mới
        const newCategory = await LoaiSanPham.create({ TenLoai });
        return res.status(200).json({ message: 'Loại sản phẩm đã được tạo thành công!', loaiSanPhamId: newCategory.LoaiSanPhamId });

    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

// Cập nhật loại sản phẩm

const putproducttype = async (req, res) => {
    const { id } = req.params;
    const { TenLoai } = req.body;
    // return res.status(200).json({ message: 'check:', id, TenLoai });

    try {
        const existingProductType = await LoaiSanPham.findOne({
            where: {
                TenLoai,
                LoaiSanPhamId: { [Op.ne]: id }  // Kiểm tra trừ loại sản phẩm hiện tại
            }
        });
        // const existingProduct = await SanPham.findOne({
        //     where: {
        //         TenSanPham,
        //         SanPhamId: { [Op.ne]: id } // Kiểm tra sản phẩm khác với id hiện tại
        //     },
        // });
        if (existingProductType) {
            return res.status(201).json({ warning: 'Tên loại sản phẩm đã tồn tại.' });
        }
        // Cập nhật loại sản phẩm
        const updatedRowCount = await LoaiSanPham.update(
            { TenLoai },
            { where: { LoaiSanPhamId: id } }
        );

        if (updatedRowCount === 0) {
            return res.status(201).json({ warning: 'Loại sản phẩm không tồn tại.' });
        }

        return res.status(200).json({ message: 'Loại sản phẩm đã được cập nhật thành công!' });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Xóa loại sản phẩm
const deleteproducttype = async (req, res) => {
    const { id } = req.params;

    try {
        const deleted = await LoaiSanPham.destroy({
            where: { LoaiSanPhamId: id },
        });

        if (deleted === 0) {
            return res.status(201).json({ warning: 'Loại sản phẩm không tồn tại.' });
        }

        return res.status(200).json({ message: 'Loại sản phẩm đã được xóa thành công!' });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

const deleteproducttypes = async (req, res) => {
    const data = req.body;

    if (!Array.isArray(data) || data.length === 0) {
        return res.status(201).json({ warning: "Danh sách sản phẩm không hợp lệ!" });
    }

    try {
        const deleted = await LoaiSanPham.destroy({
            where: { LoaiSanPhamId: data },
        });

        if (deleted === 0) {
            return res.status(201).json({ warning: 'Loại sản phẩm không tồn tại.' });
        }


        return res.status(200).json({ message: `Đã xóa thành công ${deleted} loại sản phẩm.` });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};


module.exports = { getproducttype, postproducttype, putproducttype, deleteproducttype, deleteproducttypes };