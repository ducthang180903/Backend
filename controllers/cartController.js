const pool = require('../config/database'); // Đảm bảo bạn đã cấu hình kết nối tới database
const ChiTietSanPham = require('../models/chitietsanphamModels');
const  cartService  = require('../services/cartservice');
const SanPham = require('../models/productModel'); 
const jwt = require('jsonwebtoken');
// Thêm sản phẩm vào giỏ hàng (tự động phân biệt giữa người dùng đã đăng nhập và chưa đăng nhập)


// const postcartProducts = async (req, res) => {
//     try {
//         const userId = req.session.user ? req.session.user.NguoiDungId : null; // Lấy ID người dùng từ session
//         const { SanPhamId, SoLuong } = req.body; // Lấy sản phẩm và số lượng từ request body
//         const SessionId = req.session.SessionId;
//         // Gọi hàm thêm sản phẩm vào giỏ hàng từ CartService
//         const result = await cartService.addToCart(SessionId ,userId, SanPhamId, SoLuong);

//         return res.status(200).json({
//             message: 'Thêm sản phẩm vào giỏ hàng thành công!',
//             result
//         });
//     } catch (error) {
//         console.error('Lỗi khi thêm sản phẩm vào giỏ hàng:', error);
//         return res.status(400).json({ message: error.message });
//     }
// };
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







// Xóa sản phẩm khỏi giỏ hàng
// const deleteCartProduct = async (req, res) => {
//     const sanPhamId = req.params.sanPhamId; // Lấy SanPhamId từ tham số URL
//     const userId = req.session.user ? req.session.user.NguoiDungId : null; // Lấy ID người dùng từ session
//     const sessionId = req.sessionID; // Lấy SessionId từ session
//     console.log('NguoiDungId:', userId); // Log NguoiDungId
//     try {
//         const deletedProduct = await cartService.deleteCartProduct(sanPhamId, userId, sessionId);
//         return res.status(200).json({ status: 'success', message: deletedProduct.message });
//     } catch (error) {
//         return res.status(400).json({ message: error.message });
//     }
// };
const deleteCartProduct = async (req, res) => {
    const { SanPhamId, ChiTietSanPhamId } = req.body;  // Lấy SanPhamId và ChiTietSanPhamId từ request body

    // Kiểm tra xem SanPhamId và ChiTietSanPhamId có được cung cấp hay không
    if (!SanPhamId || !ChiTietSanPhamId) {
        return res.status(400).json({ message: 'Cần cung cấp SanPhamId và ChiTietSanPhamId.', status: 'error' });
    }

    try {
        // Gọi hàm deleteCartProduct từ service, truyền vào req và các tham số cần thiết
        const result = await cartService.deleteCartProduct(req, SanPhamId, ChiTietSanPhamId);

        // Kiểm tra kết quả từ service và phản hồi với status code tương ứng
        if (result.status === 'success') {
            return res.status(200).json({ message: result.message });
        } else if (result.status === 'warning') {
            return res.status(404).json({ message: result.message });
        } else {
            return res.status(401).json({ message: result.message });
        }
    } catch (error) {
        console.error('Lỗi khi xóa sản phẩm khỏi giỏ hàng:', error);
        return res.status(500).json({ message: 'Đã xảy ra lỗi khi xóa sản phẩm khỏi giỏ hàng.' });
    }
};








// const deleteCartProduct = async (req, res) => {
//     const { SanPhamId } = req.body;
//     const NguoiDungId = req.session.userId || null; // Nếu người dùng đã đăng nhập
//     const SessionId = req.sessionID; // Sử dụng sessionId cho người dùng chưa đăng nhập

//     try {
//         // Kiểm tra xem giỏ hàng đã tồn tại cho người dùng hoặc session này chưa
//         let [cart] = await pool.query(
//             'SELECT * FROM GioHang WHERE (NguoiDungId = ? OR SessionId = ?) LIMIT 1',
//             [NguoiDungId, SessionId]
//         );

//         if (cart.length === 0) {
//             return res.status(201).json({ message: 'Không tìm thấy giỏ hàng.', status: 'warning' });
//         }

//         const GioHangId = cart[0].GioHangId;

//         // Kiểm tra xem sản phẩm có tồn tại trong giỏ hàng không
//         const [existingProduct] = await pool.query(
//             'SELECT * FROM ChiTietGioHang WHERE GioHangId = ? AND SanPhamId = ?',
//             [GioHangId, SanPhamId]
//         );

//         if (existingProduct.length === 0) {
//             return res.status(201).json({ message: 'Sản phẩm không có trong giỏ hàng.', status: 'warning' });
//         }

//         // Xóa sản phẩm khỏi giỏ hàng
//         await pool.query(
//             'DELETE FROM ChiTietGioHang WHERE GioHangId = ? AND SanPhamId = ?',
//             [GioHangId, SanPhamId]
//         );

//         res.status(200).json({ message: 'Sản phẩm đã bị xóa khỏi giỏ hàng thành công!', status: 'success' });
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// };


const getCart = async (req, res) => {
    if (!req.user) {
        return res.status(401).json({
            message: 'Người dùng chưa đăng nhập.',
            status: 'warning',
            cartDetails: []
        });
    }

    try {
        const cartData = await cartService.getCart(req.user.NguoiDungId); // Gọi service với NguoiDungId
        
        // Kiểm tra cartData để đảm bảo nó không bị undefined
        if (!cartData) {
            return res.status(500).json({
                message: 'Có lỗi xảy ra khi lấy giỏ hàng.',
                status: 'error'
            });
        }

        return res.status(200).json(cartData);
    } catch (error) {
        return res.status(500).json({
            message: error.message || 'Có lỗi xảy ra trong quá trình xử lý.',
            status: 'error'
        });
    }
};













// deleteCartProduct , getCart


module.exports = {
    postcartProducts, getCart ,deleteCartProduct
};
