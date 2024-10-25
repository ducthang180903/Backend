const LoaiSanPham = require('../models/producttypeModel');
const { Op } = require('sequelize');


// Kiểm tra và thêm loại sản phẩm mới
const createProductCategory = async (TenLoai) => {
    // Kiểm tra nếu loại sản phẩm đã tồn tại
    const existingCategory = await LoaiSanPham.findOne({
      where: { TenLoai }
    });
    if (existingCategory) {
      return { status: 'warning', message: 'Tên loại sản phẩm đã tồn tại.' };
    }
    // Nếu không tồn tại, thêm loại sản phẩm mới
    const newCategory = await LoaiSanPham.create({ TenLoai });
    return { status: 'success', message: 'Loại sản phẩm đã được tạo thành công!', loaiSanPhamId: newCategory.LoaiSanPhamId };
  };
  
  //lấy tất cả loại sản phẩm
const getAllProductTypes = async () => {
    const productTypes = await LoaiSanPham.findAll();
    return productTypes;
};


// Hàm cập nhật loại sản phẩm
const updateProductType = async (id, TenLoai) => {
    // Kiểm tra tên loại sản phẩm mới đã tồn tại chưa
    const existingProductType = await LoaiSanPham.findOne({
        where: {
            TenLoai,
            LoaiSanPhamId: { [Op.ne]: id }  // Kiểm tra trừ loại sản phẩm hiện tại
        }
    });
    if (existingProductType) {
        return { message: 'Tên loại sản phẩm đã tồn tại.', status: 'warning' };
    }
    // Cập nhật loại sản phẩm
    const [updatedRowCount] = await LoaiSanPham.update(
        { TenLoai },
        { where: { LoaiSanPhamId: id } }
    );
    if (updatedRowCount === 0) {
        return { message: 'Loại sản phẩm không tồn tại.', status: 'warning' };
    }
    return { message: 'Loại sản phẩm đã được cập nhật thành công!', status: 'success' };
};

//xóa loại sản phẩm
const deleteProductType = async (id) => {
    try {
        const deleted = await LoaiSanPham.destroy({
            where: { LoaiSanPhamId: id },
        });

        if (deleted === 0) {
            return {
                status: 'warning',
                message: 'Loại sản phẩm không tồn tại.',
            };
        }

        return {
            status: 'success',
            message: 'Loại sản phẩm đã được xóa thành công!',
        };
    } catch (error) {
        throw new Error(error.message);
    }
};

  module.exports = { createProductCategory , getAllProductTypes , updateProductType , deleteProductType}; 