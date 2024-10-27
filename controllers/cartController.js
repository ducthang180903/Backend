const pool = require('../config/database'); // Đảm bảo bạn đã cấu hình kết nối tới database
const  cartService  = require('../services/cartservice');

// Thêm sản phẩm vào giỏ hàng (tự động phân biệt giữa người dùng đã đăng nhập và chưa đăng nhập)


const postcartProducts = async (req, res) => {
    try {
        const userId = req.session.user ? req.session.user.NguoiDungId : null; // Lấy ID người dùng từ session
        const { SanPhamId, SoLuong } = req.body; // Lấy sản phẩm và số lượng từ request body
        const SessionId = req.session.SessionId;
        // Gọi hàm thêm sản phẩm vào giỏ hàng từ CartService
        const result = await cartService.addToCart(SessionId ,userId, SanPhamId, SoLuong);

        return res.status(200).json({
            message: 'Thêm sản phẩm vào giỏ hàng thành công!',
            result
        });
    } catch (error) {
        console.error('Lỗi khi thêm sản phẩm vào giỏ hàng:', error);
        return res.status(400).json({ message: error.message });
    }
};


// Xóa sản phẩm khỏi giỏ hàng
const deleteCartProduct = async (req, res) => {
    const sanPhamId = req.params.sanPhamId; // Lấy SanPhamId từ tham số URL
    const userId = req.session.user ? req.session.user.NguoiDungId : null; // Lấy ID người dùng từ session
    const sessionId = req.sessionID; // Lấy SessionId từ session
    console.log('NguoiDungId:', userId); // Log NguoiDungId
    try {
        const deletedProduct = await cartService.deleteCartProduct(sanPhamId, userId, sessionId);
        return res.status(200).json({ status: 'success', message: deletedProduct.message });
    } catch (error) {
        return res.status(400).json({ message: error.message });
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
    const userId = req.session.user ? req.session.user.NguoiDungId : null; // Lấy NguoiDungId từ session
    const SessionId = req.session.SessionId; // Lấy SessionId từ session

    try {
        const result = await cartService.getCart(userId, SessionId);

        // Trả về kết quả
        res.status(result.status === 'success' ? 200 : 201).json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};












// deleteCartProduct , getCart


module.exports = {
    postcartProducts, getCart ,deleteCartProduct
};
