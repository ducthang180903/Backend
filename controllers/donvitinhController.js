// controllers/producttypeController.js

const pool = require('../config/database');
const  { createDVT, getAllDVT, updateDVT , deleteDVT }  = require('../services/donvitinhService');


// Lấy tất cả loại sản phẩm
const getproducttype = async (req, res) => {
    try {
        const productTypes = await getAllDVT();
        res.status(200).json(productTypes);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};



// Thêm loại sản phẩm
const postproducttype = async (req, res) => {
    const { TenDonVi } = req.body;
  
    try {
      // Gọi service để thêm loại sản phẩm mới
      const result = await createDVT(TenDonVi);
  
      if (result.status === 'warning') {
        return res.status(201).json(result); // Trả về cảnh báo nếu loại sản phẩm đã tồn tại
      }
  
      // Trả về phản hồi thành công
      return res.status(200).json(result);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  };


// Cập nhật loại sản phẩm

const putproducttype = async (req, res) => {
    const { id } = req.params;
    const { TenDonVi } = req.body;

    try {
        const updateResponse = await updateDVT(id, TenDonVi);
        
        if (updateResponse.status === 'warning') {
            return res.status(201).json(updateResponse);
        }

        res.status(200).json(updateResponse);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// Xóa loại sản phẩm
const deleteproducttype = async (req, res) => {
    const { id } = req.params;

    try {
        const response = await deleteDVT(id);

        if (response.status === 'warning') {
            return res.status(404).json(response); // Sử dụng 404 cho trường hợp không tìm thấy
        }

        res.status(200).json(response);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};


module.exports = { getproducttype , postproducttype , putproducttype , deleteproducttype};
