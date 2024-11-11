// controllers/chitietsanphamController.js
const chitietsanpham = require('../services/chitietsanphamService');

// Hàm lấy tất cả chi tiết sản phẩm
// Lấy tất cả loại sản phẩm
const fetchChiTietSanPham = async (req, res) => {
    const sanPhamId = req.params.id; // Giả sử bạn lấy SanPhamId từ params của URL

    try {
        const chiTietSanPhamList = await chitietsanpham.getChiTietSanPham(sanPhamId);
        return res.json(chiTietSanPhamList);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

const showAllChiTietSanPham = async (req, res) => {
    try {
        const chiTietSanPhamList = await chitietsanpham.getAllChiTietSanPham();
        return res.json(chiTietSanPhamList);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

const addChiTietSanPham = async (req, res) => {
    const { sanPhamId, loaiChiTiet, gia, soLuong } = req.body;

    if (!sanPhamId || !loaiChiTiet || !gia || !soLuong) {
        return res.status(201).json({ warning: 'Dữ liệu không hợp lệ' });
    }

    try {
        await chitietsanpham.addChiTietSanPham(
            sanPhamId,
            loaiChiTiet,
            gia,
            soLuong
        );

        return res.status(200).json({
            message: 'Thêm chi tiết sản phẩm thành công'
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: error.message });
    }
};
// Hàm sửa chi tiết sản phẩm

const updateChiTietSanPham = async (req, res) => {
    const { id } = req.params; // Lấy id từ URL
    const { sanPhamId, loaiChiTiet, gia, soLuong } = req.body; // Lấy dữ liệu từ request body

    try {
        // Gọi service để cập nhật chi tiết sản phẩm
        const updatedChiTietSanPham = await chitietsanpham.updateChiTietSanPham(id, sanPhamId, loaiChiTiet, gia, soLuong);

        // Trả về kết quả
        res.status(200).json({
            success: 'Chi tiết sản phẩm đã được cập nhật thành công',
            data: updatedChiTietSanPham,
        });
    } catch (error) {
        res.status(500).json({
            warning: `Lỗi khi cập nhật chi tiết sản phẩm: ${error.warning}`,
        });
    }
};

const deleteChiTietSanPham = async (req, res) => {
    const { id } = req.params; // Lấy id từ URL

    try {
        // Gọi service để xóa chi tiết sản phẩm
        const deletedChiTietSanPham = await chitietsanpham.deleteChiTietSanPham(id);

        // Trả về kết quả
        res.status(200).json({
            success: 'Chi tiết sản phẩm đã được xóa thành công',
            data: deletedChiTietSanPham,
        });
    } catch (error) {
        res.status(500).json({
            warning: `Lỗi khi xóa chi tiết sản phẩm: ${error.warning}`,
        });
    }
};
module.exports = {
    fetchChiTietSanPham, showAllChiTietSanPham, addChiTietSanPham, updateChiTietSanPham, deleteChiTietSanPham
};
