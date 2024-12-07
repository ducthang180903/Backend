const ChiTietSanPham = require('../models/chitietsanphamModels');
const SanPham = require('../models/productModel'); // Chắc chắn rằng đường dẫn là đúng
const HinhAnhSanPham = require('../models/imgproductModel');
const DonViTinh = require('../models/donViTinhModel');

// Hàm lấy tất cả chi tiết sản phẩm
const getChiTietSanPham = async (sanPhamId) => {
    try {
        // Tìm tất cả chi tiết sản phẩm theo SanPhamId và bao gồm thông tin từ SanPham
        const chiTietSanPhamList = await ChiTietSanPham.findAll({
            where: {
                SanPhamId: sanPhamId, // Lọc theo SanPhamId
            },
            include: [
                {
                    model: SanPham, // Bao gồm thông tin từ mô hình SanPham
                    required: true, // Chỉ lấy nếu có sản phẩm tương ứng
                },
            ],
        });

        // Kiểm tra nếu không tìm thấy chi tiết sản phẩm
        if (!chiTietSanPhamList.length) {
            return { warning: 'Không có chi tiết sản phẩm nào tồn tại cho sản phẩm này', status: 201 };
        }

        return { success: 'Lấy chi tiết sản phẩm thành công', status: 200, data: chiTietSanPhamList };
    } catch (error) {
        return { warning: `Lỗi khi lấy chi tiết sản phẩm: ${error.message}`, status: 201 };
    }
};

// Hàm lấy tất cả chi tiết sản phẩm
const getAllChiTietSanPham = async () => {
    try {
        // Lấy tất cả chi tiết sản phẩm và bao gồm thông tin từ SanPham và HinhAnhSanPham
        const chiTietSanPhamList = await ChiTietSanPham.findAll({
            include: [
                {
                    model: SanPham, // Bao gồm thông tin từ mô hình SanPham
                    required: true,
                    include: [
                        {
                            model: HinhAnhSanPham, // Bao gồm thông tin từ mô hình HinhAnhSanPham
                            required: false, // Không bắt buộc phải có hình ảnh
                        },
                        {
                            model: DonViTinh, // Bao gồm thông tin từ mô hình HinhAnhSanPham
                            attributes: ['TenDonVi'],
                        },
                    ],
                },
            ],
        });

        return { message: 'Lấy danh sách chi tiết sản phẩm thành công', status: 200, data: chiTietSanPhamList };
    } catch (error) {
        return { warning: `Lỗi khi lấy danh sách chi tiết sản phẩm: ${error.message}`, status: 201 };
    }
};

const addChiTietSanPham = async (sanPhamId, loaiChiTiet, gia, soLuong) => {
    try {
        // Kiểm tra nếu sản phẩm có tồn tại trong cơ sở dữ liệu
        const sanPham = await SanPham.findByPk(sanPhamId);
        if (!sanPham) {
            return { warning: 'Sản phẩm không tồn tại', status: 201 };
        }

        // Tạo mới chi tiết sản phẩm
        const newChiTietSanPham = await ChiTietSanPham.create({
            SanPhamId: sanPhamId,
            LoaiChiTiet: loaiChiTiet,
            Gia: gia,
            SoLuong: soLuong,
        });

        return { success: 'Thêm chi tiết sản phẩm thành công', status: 200, data: newChiTietSanPham };
    } catch (error) {
        return { warning: `Lỗi khi thêm chi tiết sản phẩm: ${error.message}`, status: 201 };
    }
};

const updateChiTietSanPham = async (chiTietSanPhamId, sanPhamId, loaiChiTiet, gia, soLuong) => {
    try {
        // Kiểm tra nếu chi tiết sản phẩm có tồn tại trong cơ sở dữ liệu
        const chiTietSanPham = await ChiTietSanPham.findByPk(chiTietSanPhamId);
        if (!chiTietSanPham) {
            return { warning: 'Chi tiết sản phẩm không tồn tại', status: 201 };
        }

        // Kiểm tra nếu sản phẩm có tồn tại trong cơ sở dữ liệu
        const sanPham = await SanPham.findByPk(sanPhamId);
        if (!sanPham) {
            return { warning: 'Sản phẩm không tồn tại', status: 201 };
        }

        // Cập nhật chi tiết sản phẩm
        chiTietSanPham.LoaiChiTiet = loaiChiTiet || chiTietSanPham.LoaiChiTiet;  // Nếu không truyền, giữ nguyên giá trị cũ
        chiTietSanPham.Gia = gia || chiTietSanPham.Gia; // Cập nhật nếu có giá mới
        chiTietSanPham.SoLuong = soLuong || chiTietSanPham.SoLuong; // Cập nhật nếu có số lượng mới

        // Lưu lại thay đổi
        await chiTietSanPham.save();

        return { success: 'Cập nhật chi tiết sản phẩm thành công', status: 200, data: chiTietSanPham };
    } catch (error) {
        return { warning: `Lỗi khi sửa chi tiết sản phẩm: ${error.message}`, status: 201 };
    }
};

// Hàm xóa chi tiết sản phẩm
const deleteChiTietSanPham = async (id) => {
    try {
        // Tìm chi tiết sản phẩm theo id
        const chiTietSanPham = await ChiTietSanPham.findByPk(id);
        if (!chiTietSanPham) {
            return { warning: 'Chi tiết sản phẩm không tồn tại', status: 201 };
        }

        // Xóa chi tiết sản phẩm
        await chiTietSanPham.destroy();

        return { success: 'Xóa chi tiết sản phẩm thành công', status: 200, data: chiTietSanPham };
    } catch (error) {
        return { warning: `Lỗi khi xóa chi tiết sản phẩm: ${error.message}`, status: 201 };
    }
};

module.exports = {
    getChiTietSanPham,
    getAllChiTietSanPham,
    addChiTietSanPham,
    updateChiTietSanPham,
    deleteChiTietSanPham,
};
