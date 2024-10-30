const pool = require('../config/database');
const productService = require('../services/productService');


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
    try {
        const result = await productService.createProduct(req.body);
        if (result.status === 'warning') {
            return res.status(201).json(result);
        }

        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Sửa sản phẩm
const putproduct = async (req, res) => {
    const { id } = req.params; // Lấy id từ params

    try {
        const result = await productService.updateProduct(id, req.body); // Gọi hàm service để cập nhật sản phẩm

        // Kiểm tra trạng thái kết quả và trả về mã trạng thái tương ứng
        if (result.status === 'warning') {
            return res.status(201).json(result);
        } else if (result.status === 'error') {
            return res.status(404).json(result);
        }

        res.status(200).json(result); // Trả về phản hồi thành công
    } catch (error) {
        res.status(500).json({ error: error.message }); // Xử lý lỗi
    }
};

// Xóa sản phẩm
const deleteproduct = async (req, res) => {
    const { id } = req.params;

    try {
        const result = await productService.deleteProduct(id); // Gọi hàm service để xóa sản phẩm

        // Kiểm tra trạng thái kết quả và trả về mã trạng thái tương ứng
        if (result.status === 'warning') {
            return res.status(201).json(result);
        } else if (result.status === 'error') {
            return res.status(404).json(result);
        }

        res.status(200).json(result); // Trả về phản hồi thành công
    } catch (error) {
        res.status(500).json({ error: error.message }); // Xử lý lỗi
    }
};



module.exports = { getproduct, postproduct, putproduct, deleteproduct };