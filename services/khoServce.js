const Kho = require('../models/khoModels'); // Đảm bảo import đúng các mô hình
const sanPham = require('../models/productModel'); 

const putkhoService = {
    async updateKhoWithProduct(KhoId, SoLuong, DiaDiem) {
        // Kiểm tra xem kho có tồn tại không
        const kho = await Kho.findByPk(KhoId);
        if (!kho) {
            console.log(`Không tìm thấy kho với KhoId: ${KhoId}`);
            throw new Error('Kho không tồn tại.');
        }

        console.log(`Kho tìm thấy:`, kho);

        // Kiểm tra xem sản phẩm liên kết với kho có tồn tại không
        const SanPham = await sanPham.findByPk(kho.SanPhamId); // Đảm bảo đây là đúng tên mô hình
        if (!sanPham) {
            console.log(`Không tìm thấy sản phẩm với SanPhamId: ${kho.SanPhamId}`);
            throw new Error('Sản phẩm liên kết với kho không tồn tại.');
        }

        console.log(`Sản phẩm liên kết với kho:`, SanPham);

        // Cập nhật kho
        console.log(`Cập nhật kho ${KhoId} với SoLuong: ${SoLuong}, DiaDiem: ${DiaDiem}`);
        kho.SoLuong = SoLuong;
        kho.DiaDiem = DiaDiem;
        await kho.save(); // Lưu thay đổi

        console.log(`Kho sau khi cập nhật:`, kho);
        return kho; // Trả về thông tin kho đã được cập nhật
    }
};



const khoService = {
    async addKhoWithProduct(SanPhamId, SoLuong, DiaDiem) {
        // Kiểm tra xem sản phẩm có tồn tại không
        const product = await sanPham.findOne({ where: { SanPhamId } });

        // Nếu sản phẩm không tồn tại, trả về lỗi
        if (!product) {
            throw new Error('Sản phẩm không tồn tại, không thể thêm kho mới.');
        }

        // Kiểm tra xem kho có tồn tại cho sản phẩm này không
        const existingKho = await Kho.findOne({ where: { SanPhamId } });

        if (existingKho) {
            // Nếu kho đã tồn tại, cập nhật số lượng
            existingKho.SoLuong += SoLuong; // Cộng thêm số lượng
            await existingKho.save(); // Lưu thay đổi
            return { khoId: existingKho.KhoId, message: 'Cập nhật số lượng kho thành công!' };
        } else {
            // Nếu kho chưa tồn tại, thêm kho mới
            const kho = await Kho.create({ SanPhamId, SoLuong, DiaDiem });
            return { khoId: kho.KhoId, message: 'Kho đã được thêm thành công!' };
        }
    }
};
const getkhoService = {
    async getKhoWithProducts() {
        try {
            // Truy vấn thông tin kho và sản phẩm bằng Sequelize
            const khoProducts = await Kho.findAll({
                include: [{
                    model: sanPham,
                    attributes: ['TenSanPham'] // Chỉ lấy trường TenSanPham từ SanPham
                }]
            });
            return khoProducts;
        } catch (error) {
            throw new Error(error.message); // Ném lỗi để xử lý ở controller
        }
    }
};
const deletekhoService = {
    async deleteKhoWithProduct(KhoId) {
        // Kiểm tra xem kho có tồn tại không
        const kho = await Kho.findByPk(KhoId);
        if (!kho) {
            throw new Error('Kho không tồn tại.');
        }

        // Kiểm tra xem sản phẩm liên kết với kho có tồn tại không
        const SanPham = await sanPham.findByPk(kho.SanPhamId);
        if (!SanPham) {
            throw new Error('Sản phẩm liên kết với kho không tồn tại.');
        }

        // Xóa kho
        await kho.destroy(); // Gọi phương thức destroy để xóa

        return kho; // Trả về thông tin kho đã xóa
    }
};



module.exports ={ khoService, getkhoService , putkhoService , deletekhoService}
