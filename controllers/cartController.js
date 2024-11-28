const pool = require('../config/database'); // Đảm bảo bạn đã cấu hình kết nối tới database
const ChiTietSanPham = require('../models/chitietsanphamModels');
const cartService = require('../services/cartservice');
const SanPham = require('../models/productModel');
const jwt = require('jsonwebtoken');
const { verifyToken } = require('../config/jwt');

const getCart = async (req, res) => {
    const token = req.session.user;
    // return res.json({ token })
    if (!token) {
        return res.status(201).json({
            warning: 'Người dùng chưa đăng nhập.',
            cartDetails: []
        });
    }

    try {
        const user = verifyToken(token);
        // return res.json(user.id)
        const cartData = await cartService.getCart(user.id); // Gọi service với NguoiDungId
        // return res.json({ cartData })
        // Kiểm tra cartData để đảm bảo nó không bị undefined
        if (!cartData) {
            return res.status(500).json({
                error: 'Có lỗi xảy ra khi lấy giỏ hàng.',
            });
        }

        return res.status(200).json(cartData?.cart || []);
    } catch (error) {
        return res.status(500).json({
            error: error.message || 'Có lỗi xảy ra trong quá trình xử lý.',
        });
    }
};

const postcartProducts = async (req, res) => {
    try {
        // Lấy sản phẩm và số lượng từ request body
        const { SanPhamId, SoLuong, ChiTietSanPhamId } = req.body;

        // Kiểm tra dữ liệu đầu vào
        if (!SanPhamId || !SoLuong || !ChiTietSanPhamId) {
            return res.status(400).json({ warning: 'Sản phẩm, số lượng và chi tiết sản phẩm là bắt buộc.' });
        }

        // Kiểm tra xem SanPhamId có tồn tại không
        const existingProduct = await SanPham.findOne({ where: { SanPhamId } });
        if (!existingProduct) {
            return res.status(404).json({ warning: 'Sản phẩm không tồn tại trong hệ thống.' });
        }

        // Kiểm tra xem ChiTietSanPhamId có tồn tại không
        const existingDetail = await ChiTietSanPham.findOne({ where: { ChiTietSanPhamId } });
        if (!existingDetail) {
            return res.status(404).json({ warning: 'Chi tiết sản phẩm không tồn tại trong hệ thống.' });
        }

        // Gọi hàm thêm sản phẩm vào giỏ hàng từ CartService
        const result = await cartService.addToCart(req, SanPhamId, SoLuong, ChiTietSanPhamId);

        // Trả về kết quả thành công
        return res.status(200).json({
            message: 'Đã Thêm Sản Phẩm vào giỏ hàng!',
            result
        });
    } catch (error) {
        console.error('Lỗi khi thêm sản phẩm vào giỏ hàng:', error);
        return res.status(500).json({ warning: 'Có lỗi xảy ra khi thêm sản phẩm vào giỏ hàng.' });
    }
};

const updateCartProduct = async (req, res) => {
    const { SanPhamId, ChiTietSanPhamId, SoLuong } = req.body;

    if (!SanPhamId || !ChiTietSanPhamId || !SoLuong) {
        return res.status(201).json({ warning: 'Cần cung cấp SanPhamId, ChiTietSanPhamId và SoLuong.' });
    }

    try {
        const result = await cartService.updateCartProduct(req, SanPhamId, ChiTietSanPhamId, SoLuong);
        if (result.status === 200) {
            return res.status(200).json({ message: result.message });
        } else {
            return res.status(201).json({ warning: result.warning });
        }
    } catch (error) {
        console.error('Lỗi khi cập nhật sản phẩm trong giỏ hàng:', error);
        return res.status(500).json({ error: 'Đã xảy ra lỗi khi cập nhật sản phẩm trong giỏ hàng.' });
    }
};

const deleteCartProduct = async (req, res) => {
    const { SanPhamId, ChiTietSanPhamId } = req.params;  // Lấy SanPhamId và ChiTietSanPhamId từ request body

    // Kiểm tra xem SanPhamId và ChiTietSanPhamId có được cung cấp hay không
    if (!SanPhamId || !ChiTietSanPhamId) {
        return res.status(400).json({ warning: 'Cần cung cấp SanPhamId và ChiTietSanPhamId.' });
    }
    // return res.json({ SanPhamId, ChiTietSanPhamId })
    try {
        // Gọi hàm deleteCartProduct từ service, truyền vào req và các tham số cần thiết
        const result = await cartService.deleteCartProduct(req, SanPhamId, ChiTietSanPhamId);

        // Kiểm tra kết quả từ service và phản hồi với status code tương ứng
        if (result.status === 'success') {
            return res.status(200).json({ message: result.message });
        } else if (result.status === 'warning') {
            return res.status(201).json({ warning: result.warning });
        } else {
            return res.status(401).json({ warning: result.warning });
        }
    } catch (error) {
        console.error('Lỗi khi xóa sản phẩm khỏi giỏ hàng:', error);
        return res.status(500).json({ error: 'Đã xảy ra lỗi khi xóa sản phẩm khỏi giỏ hàng.' });
    }
};


module.exports = {
    postcartProducts, getCart, updateCartProduct, deleteCartProduct
};
