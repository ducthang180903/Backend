const pool = require('../config/database');


// Hiển thị tất cả kho kèm thông tin sản phẩm
const getkhoWithProducts = async (req, res) => {
    try {
        const [results] = await pool.query(`
            SELECT 
                Kho.KhoId, 
                Kho.SanPhamId, 
                Kho.SoLuong, 
                Kho.DiaDiem, 
                SanPham.TenSanPham 
            FROM Kho 
            JOIN SanPham ON Kho.SanPhamId = SanPham.SanPhamId
        `);
        res.json(results);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const postkhoWithProducts = async (req, res) => {
    const { SanPhamId, SoLuong, DiaDiem } = req.body;

    try {
        // Kiểm tra xem sản phẩm có tồn tại hay không
        const [productResults] = await pool.query('SELECT * FROM SanPham WHERE SanPhamId = ?', [SanPhamId]);

        // Nếu sản phẩm đã tồn tại, không thêm kho mới
        if (productResults.length > 0) {
            return res.status(201).json({ status: 'warning', message: 'Sản phẩm đã tồn tại, không thể thêm kho mới.' });
        }

        // Nếu sản phẩm không tồn tại, thêm kho mới
        const [results] = await pool.query(
            'INSERT INTO Kho (SanPhamId, SoLuong, DiaDiem) VALUES (?, ?, ?)',
            [SanPhamId, SoLuong, DiaDiem]
        );

        res.status(200).json({ status: 'success', message: 'Kho đã được thêm thành công!', khoId: results.insertId });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


const putkhoWithProducts = async (req, res) => {
    const { id } = req.params; // ID của kho từ URL
    const { SoLuong, DiaDiem } = req.body; // Thông tin cần cập nhật từ body

    try {
        // Kiểm tra xem kho có tồn tại không
        const [khoResults] = await pool.query('SELECT * FROM Kho WHERE KhoId = ?', [id]);
        if (khoResults.length === 0) {
            return res.status(201).json({ message: 'Kho không tồn tại.', status: 'warning' });
        }

        // Kiểm tra xem sản phẩm liên kết với kho có tồn tại không
        const [productResults] = await pool.query('SELECT * FROM SanPham WHERE SanPhamId = ?', [khoResults[0].SanPhamId]);
        if (productResults.length === 0) {
            return res.status(201).json({ message: 'Sản phẩm liên kết với kho không tồn tại.', status: 'warning' });
        }

        // Cập nhật kho
        await pool.query(
            'UPDATE Kho SET SoLuong = ?, DiaDiem = ? WHERE KhoId = ?',
            [SoLuong, DiaDiem, id]
        );

        res.status(200).json({ message: 'Kho đã được cập nhật thành công!', status: 'success' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


const deletekhoWithProducts = async (req, res) => {
    const { id } = req.params; // Lấy ID của kho từ tham số URL

    try {
        // Kiểm tra xem kho có tồn tại không
        const [khoResults] = await pool.query('SELECT * FROM Kho WHERE KhoId = ?', [id]);
        if (khoResults.length === 0) {
            return res.status(201).json({ message: 'Kho không tồn tại.', status: 'warning' });
        }

        // Kiểm tra xem sản phẩm liên kết với kho có tồn tại không
        const [productResults] = await pool.query('SELECT * FROM SanPham WHERE SanPhamId = ?', [khoResults[0].SanPhamId]);
        if (productResults.length === 0) {
            return res.status(201).json({ message: 'Sản phẩm liên kết với kho không tồn tại.', status: 'warning' });
        }

        // Xóa kho
        const [results] = await pool.query(
            'DELETE FROM Kho WHERE KhoId = ?',
            [id]
        );

        if (results.affectedRows === 0) {
            return res.status(201).json({ message: 'Kho không tồn tại.', status: 'warning' });
        }

        res.status(200).json({ message: 'Kho đã được xóa thành công!', status: 'success' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};



module.exports = { getkhoWithProducts , postkhoWithProducts , putkhoWithProducts , deletekhoWithProducts};