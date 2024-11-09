const DonViTinh = require('../models/donViTinhModel');
const { Op } = require('sequelize');


// Kiểm tra và thêm loại sản phẩm mới
const createDVT = async (TenDonVi) => {
    // Kiểm tra nếu loại sản phẩm đã tồn tại
    const existingCategory = await DonViTinh.findOne({
      where: { TenDonVi }
    });
    if (existingCategory) {
      return { status: 'warning', message: 'Tên loại sản phẩm đã tồn tại.' };
    }
    // Nếu không tồn tại, thêm loại sản phẩm mới
    const newCategory = await DonViTinh.create({ TenDonVi });
    return { status: 'success', message: 'Loại sản phẩm đã được tạo thành công!', DonViTinhID: newCategory.DonViTinhID };
  };
  
  //lấy tất cả loại sản phẩm
const getAllDVT = async () => {
    const productTypes = await DonViTinh.findAll();
    return productTypes;
};


// Hàm cập nhật loại sản phẩm
const updateDVT = async (id, TenDonVi) => {
    // Kiểm tra tên loại sản phẩm mới đã tồn tại chưa
    const existingProductType = await DonViTinh.findOne({
        where: {
            TenDonVi,
            DonViTinhID: { [Op.ne]: id }  // Kiểm tra trừ loại sản phẩm hiện tại
        }
    });
    if (existingProductType) {
        return { message: 'Tên loại sản phẩm đã tồn tại.', status: 'warning' };
    }
    // Cập nhật loại sản phẩm
    const [updatedRowCount] = await DonViTinh.update(
        { TenDonVi },
        { where: { DonViTinhID: id } }
    );
    if (updatedRowCount === 0) {
        return { message: 'Loại sản phẩm không tồn tại.', status: 'warning' };
    }
    return { message: 'Loại sản phẩm đã được cập nhật thành công!', status: 'success' };
};

//xóa loại sản phẩm
const deleteDVT = async (id) => {
    try {
        const deleted = await DonViTinh.destroy({
            where: { DonViTinhID: id },
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

  module.exports = { createDVT , getAllDVT , updateDVT , deleteDVT}; 