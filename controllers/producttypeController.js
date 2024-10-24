// controllers/producttypeController.js

const pool = require('../config/database');

// Lấy tất cả loại sản phẩm
const getproducttype = async (req, res) => {
    try {
        const [results] = await pool.query('SELECT * FROM LoaiSanPham'); // Sử dụng await với pool.query
        res.json(results); // Trả về kết quả
    } catch (error) {
        return res.status(500).json({ error: error.message }); // Xử lý lỗi
    }
};



// Thêm loại sản phẩm
const postproducttype = async (req, res) => {
    const { TenLoai } = req.body;

    try {
        // Kiểm tra tên loại sản phẩm đã tồn tại
        const [results] = await pool.query('SELECT * FROM LoaiSanPham WHERE TenLoai = ?', [TenLoai]);
        if (results.length > 0) {
            return res.status(201).json({ message: 'Tên loại sản phẩm đã tồn tại.', status: 'warning' });
        }

        // Nếu tên loại không tồn tại, thêm loại sản phẩm mới
        const [insertResult] = await pool.query('INSERT INTO LoaiSanPham (TenLoai) VALUES (?)', [TenLoai]);

        // Trả về phản hồi thành công
        res.status(200).json({ message: 'Loại sản phẩm đã được tạo thành công!', loaiSanPhamId: insertResult.insertId, status: 'success' });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};


// Cập nhật loại sản phẩm
const putproducttype = async (req, res) => {
    const { id } = req.params;
    const { TenLoai } = req.body;

    try {
        // Kiểm tra tên loại sản phẩm mới đã tồn tại chưa
        const [results] = await pool.query('SELECT * FROM LoaiSanPham WHERE TenLoai = ? AND LoaiSanPhamId != ?', [TenLoai, id]);
        if (results.length > 0) {
            return res.status(201).json({ message: 'Tên loại sản phẩm đã tồn tại.', status: 'warning' });
        }

        // Cập nhật loại sản phẩm
        const [updateResult] = await pool.query('UPDATE LoaiSanPham SET TenLoai = ? WHERE LoaiSanPhamId = ?', [TenLoai, id]);
        
        if (updateResult.affectedRows === 0) {
            return res.status(201).json({ message: 'Loại sản phẩm không tồn tại.', status: 'warning' });
        }

        res.status(200).json({ message: 'Loại sản phẩm đã được cập nhật thành công!', status: 'success' });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};


// Xóa loại sản phẩm
// Xóa loại sản phẩm
const deleteproducttype = async (req, res) => {
    const { id } = req.params;

    try {
        // Thực hiện xóa loại sản phẩm
        const [results] = await pool.query('DELETE FROM LoaiSanPham WHERE LoaiSanPhamId = ?', [id]);

        if (results.affectedRows === 0) {
            return res.status(201).json({ message: 'Loại sản phẩm không tồn tại.', status: 'warning' });
        }

        res.status(200).json({ message: 'Loại sản phẩm đã được xóa thành công!', status: 'success' });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};


module.exports = { getproducttype , postproducttype , putproducttype , deleteproducttype};
