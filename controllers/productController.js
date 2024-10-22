const pool = require('../config/database');



// Hiển thị tất cả sản phẩm cùng với hình ảnh
const getproduct = async (req, res) => {
    try {
        // Truy vấn kết hợp bảng SanPham và HinhAnhSanPham
        const query = `
            SELECT 
                sp.*, 
                ha.DuongDanHinh 
            FROM 
                SanPham sp 
            LEFT JOIN 
                HinhAnhSanPham ha ON sp.SanPhamId = ha.SanPhamId 
        `;
        
        const [results] = await pool.query(query);

        // Tạo một cấu trúc dữ liệu rõ ràng
        const products = results.reduce((acc, product) => {
            const { DuongDanHinh, ...productData } = product; // Tách thông tin hình ảnh khỏi thông tin sản phẩm

            // Kiểm tra xem sản phẩm đã tồn tại trong mảng hay chưa
            const existingProduct = acc.find(item => item.SanPhamId === productData.SanPhamId);

            if (existingProduct) {
                // Nếu sản phẩm đã tồn tại, thêm hình ảnh vào mảng hình ảnh
                existingProduct.HinhAnh.push(DuongDanHinh);
            } else {
                // Nếu chưa tồn tại, tạo mới sản phẩm và khởi tạo mảng hình ảnh
                acc.push({
                    ...productData,
                    HinhAnh: DuongDanHinh ? [DuongDanHinh] : [] // Khởi tạo mảng hình ảnh
                });
            }

            return acc;
        }, []);

        res.json(products);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};





// Thêm sản phẩm (cùng với hình ảnh)
const postproduct = async (req, res) => {
    const { TenSanPham, MoTa, Gia, SoLuongKho, LoaiSanPhamId, HinhAnh } = req.body;

    try {
        // Kiểm tra xem sản phẩm đã tồn tại hay chưa
        const [existingProducts] = await pool.query('SELECT * FROM SanPham WHERE TenSanPham = ?', [TenSanPham]);
        if (existingProducts.length > 0) {
            return res.status(400).json({ message: 'Sản phẩm đã tồn tại.' });
        }

        // Thêm sản phẩm
        const [results] = await pool.query(
            'INSERT INTO SanPham (TenSanPham, MoTa, Gia, SoLuongKho, LoaiSanPhamId) VALUES (?, ?, ?, ?, ?)', 
            [TenSanPham, MoTa, Gia, SoLuongKho, LoaiSanPhamId]
        );
        const sanPhamId = results.insertId;

        // Thêm hình ảnh cho sản phẩm
        const hinhAnhQueries = HinhAnh.map(async (image) => {
            await pool.query('INSERT INTO HinhAnhSanPham (SanPhamId, DuongDanHinh) VALUES (?, ?)', [sanPhamId, image]);
        });

        // Xử lý các promise để thêm tất cả hình ảnh
        await Promise.all(hinhAnhQueries);

        res.status(201).json({ message: 'Sản phẩm đã được tạo thành công!', sanPhamId });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
// Sửa sản phẩm
const putproduct = async (req, res) => {
    const { id } = req.params;
    const { TenSanPham, MoTa, Gia, SoLuongKho, LoaiSanPhamId, HinhAnh } = req.body;

    try {
        // Kiểm tra tên sản phẩm đã tồn tại hay chưa (ngoại trừ sản phẩm hiện tại)
        const [existingProduct] = await pool.query(
            'SELECT * FROM SanPham WHERE TenSanPham = ? AND SanPhamId != ?', 
            [TenSanPham, id]
        );

        if (existingProduct.length > 0) {
            return res.status(400).json({ message: 'Tên sản phẩm đã tồn tại.' });
        }

        // Cập nhật sản phẩm
        const [updateResults] = await pool.query(
            'UPDATE SanPham SET TenSanPham = ?, MoTa = ?, Gia = ?, SoLuongKho = ?, LoaiSanPhamId = ? WHERE SanPhamId = ?', 
            [TenSanPham, MoTa, Gia, SoLuongKho, LoaiSanPhamId, id]
        );

        if (updateResults.affectedRows === 0) {
            return res.status(404).json({ message: 'Sản phẩm không tồn tại.' });
        }

        // Cập nhật hình ảnh (xóa hết hình ảnh cũ và thêm hình ảnh mới)
        await pool.query('DELETE FROM HinhAnhSanPham WHERE SanPhamId = ?', [id]);

        if (HinhAnh && HinhAnh.length > 0) {
            const hinhAnhQueries = HinhAnh.map(image => 
                pool.query('INSERT INTO HinhAnhSanPham (SanPhamId, DuongDanHinh) VALUES (?, ?)', [id, image])
            );

            // Xử lý các promise để thêm tất cả hình ảnh mới
            await Promise.all(hinhAnhQueries);
        }

        res.json({ message: 'Sản phẩm đã được cập nhật thành công!' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Xóa sản phẩm
const deleteproduct = async (req, res) => {
    const { id } = req.params;

    try {
        // Xóa hình ảnh liên quan
        await pool.query('DELETE FROM HinhAnhSanPham WHERE SanPhamId = ?', [id]);

        // Xóa sản phẩm
        const [results] = await pool.query('DELETE FROM SanPham WHERE SanPhamId = ?', [id]);

        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'Sản phẩm không tồn tại.' });
        }

        res.json({ message: 'Sản phẩm đã được xóa thành công!' });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};


module.exports = { getproduct, postproduct , putproduct , deleteproduct};