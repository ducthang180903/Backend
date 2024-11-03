const pool = require('../config/database');
const {khoService , getkhoService , putkhoService , deletekhoService} = require('../services/khoServce'); 

// Hiển thị tất cả kho kèm thông tin sản phẩm
const getkhoWithProducts = async (req, res) => {
    try {
        const khoProducts = await getkhoService.getKhoWithProducts();
        res.status(200).json(khoProducts); // Trả về kết quả
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


const postkhoWithProducts = async (req, res) => {
    const { SanPhamId, SoLuong, DiaDiem } = req.body;

    try {
        const result = await khoService.addKhoWithProduct(SanPhamId, SoLuong, DiaDiem);
        return res.status(200).json({ status: 'success', message: result.message, khoId: result.khoId });
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
};


const putkhoWithProducts = async (req, res) => {
    const { id } = req.params; // ID của kho từ URL
    const { SoLuong, DiaDiem } = req.body; // Thông tin cần cập nhật từ body

    try {
        // Gọi phương thức update từ khoService
        const updatedKho = await putkhoService.updateKhoWithProduct(id, SoLuong, DiaDiem);

        res.status(200).json({ 
            message: 'Kho đã được cập nhật thành công!', 
            status: 'success', 
            kho: updatedKho 
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


const deletekhoWithProducts = async (req, res) => {
    const { id } = req.params; // Lấy ID của kho từ tham số URL

    try {
        // Gọi hàm delete từ khoService để xóa kho
        const kho = await deletekhoService.deleteKhoWithProduct(id);
        res.status(200).json({ message: 'Kho đã được xóa thành công!', status: 'success', kho });
    } catch (error) {
        if (error.message === 'Kho không tồn tại.' || error.message === 'Sản phẩm liên kết với kho không tồn tại.') {
            return res.status(400).json({ message: error.message, status: 'warning' });
        }
        res.status(500).json({ error: error.message });
    }
};



module.exports = { getkhoWithProducts , postkhoWithProducts , putkhoWithProducts , deletekhoWithProducts};