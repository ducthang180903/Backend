const pool = require('../config/database'); // Đảm bảo bạn đã cấu hình kết nối tới database
const  cartService  = require('../services/cartservice');
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
        const { SanPhamId, SoLuong } = req.body; 

        // Kiểm tra dữ liệu đầu vào
        if (!SanPhamId || !SoLuong) {
            return res.status(400).json({ message: 'Sản phẩm và số lượng là bắt buộc.' });
        }

        // Gọi hàm thêm sản phẩm vào giỏ hàng từ CartService
        const result = await cartService.addToCart(req, SanPhamId, SoLuong); // Truyền req vào đây

        return res.status(200).json({
            message: 'Thêm sản phẩm vào giỏ hàng thành công!',
            result
        });
    } catch (error) {
        console.error('Lỗi khi thêm sản phẩm vào giỏ hàng:', error);
        return res.status(500).json({ message: 'Có lỗi xảy ra khi thêm sản phẩm vào giỏ hàng.' });
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
    const { sanPhamId } = req.params; // Lấy SanPhamId từ URL (req.params)

    try {
        // Gọi hàm deleteCartProduct từ service, truyền vào req và SanPhamId
        const result = await cartService.deleteCartProduct(req, sanPhamId);

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
