const pool = require('../config/database'); // Đảm bảo bạn đã cấu hình kết nối tới database
const  cartService  = require('../services/cartservice');

// Thêm sản phẩm vào giỏ hàng (tự động phân biệt giữa người dùng đã đăng nhập và chưa đăng nhập)


const postcartProducts = async (req, res) => {
    const { SanPhamId, SoLuong } = req.body;

    // Kiểm tra xem người dùng đã đăng nhập hay chưa
    const NguoiDungId = req.session.userId;

    if (!NguoiDungId) {
        return res.status(403).json({ message: 'Bạn cần đăng nhập để thêm sản phẩm vào giỏ hàng.' });
    }

    try {
        // Kiểm tra xem giỏ hàng đã tồn tại cho người dùng chưa
        let cart = await cartService.getCart(NguoiDungId);

        let GioHangId;

        if (!cart) {
            // Nếu giỏ hàng chưa tồn tại, tạo mới
            cart = await cartService.createCart(NguoiDungId);
            GioHangId = cart.GioHangId;
        } else {
            // Nếu giỏ hàng đã tồn tại
            GioHangId = cart.GioHangId;
        }

        // Kiểm tra xem sản phẩm đã tồn tại trong giỏ hàng chưa
        const existingProduct = await cartService.getProductInCart(GioHangId, SanPhamId);

        if (existingProduct) {
            // Nếu sản phẩm đã có trong giỏ hàng, cập nhật số lượng
            await cartService.updateProductQuantity(GioHangId, SanPhamId, SoLuong);
        } else {
            // Nếu sản phẩm chưa có trong giỏ hàng, thêm mới
            await cartService.addProductToCart(GioHangId, SanPhamId, SoLuong);
        }

        res.status(201).json({ message: 'Sản phẩm đã được thêm vào giỏ hàng thành công!' });
    } catch (error) {
        res.status(500).json({ error: error.message });
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


// const getCart = async (req, res) => {
//     const NguoiDungId = req.session.userId || null; // Nếu người dùng đã đăng nhập
//     const SessionId = req.sessionID; // Sử dụng sessionId cho người dùng chưa đăng nhập

//     try {
//         // Kiểm tra xem giỏ hàng có tồn tại cho người dùng hoặc session này không
//         let [cart] = await pool.query(
//             'SELECT * FROM GioHang WHERE (NguoiDungId = ? OR SessionId = ?) LIMIT 1',
//             [NguoiDungId, SessionId]
//         );

//         if (cart.length === 0) {
//             return res.status(201).json({ message: 'Giỏ hàng trống.', status: 'warning' });
//         }

//         const GioHangId = cart[0].GioHangId;

//         // Lấy chi tiết sản phẩm trong giỏ hàng cùng với hình ảnh
//         const [cartDetails] = await pool.query(
//             `SELECT 
//                 sp.SanPhamId, 
//                 sp.TenSanPham, 
//                 sp.Gia, 
//                 sp.MoTa, 
//                 sp.SoLuongKho, 
//                 ctgh.SoLuong,
//                 GROUP_CONCAT(ha.DuongDanHinh) AS DuongDanHinh  -- Sử dụng GROUP_CONCAT để lấy nhiều hình ảnh
//              FROM ChiTietGioHang ctgh
//              JOIN SanPham sp ON ctgh.SanPhamId = sp.SanPhamId
//              LEFT JOIN HinhAnhSanPham ha ON sp.SanPhamId = ha.SanPhamId
//              WHERE ctgh.GioHangId = ?
//              GROUP BY sp.SanPhamId`,  // Nhóm theo SanPhamId để gom hình ảnh
//             [GioHangId]
//         );

//         if (cartDetails.length === 0) {
//             return res.status(201).json({ message: 'Giỏ hàng trống.', status: 'warning' });
//         }

//         // Chuyển đổi chuỗi hình ảnh thành mảng
//         const cartWithImages = cartDetails.map(item => ({
//             ...item,
//             DuongDanHinh: item.DuongDanHinh ? item.DuongDanHinh.split(',') : []  // Chia tách chuỗi thành mảng
//         }));

//         // Trả về thông tin giỏ hàng
//         res.status(200).json({
//             message: 'Giỏ hàng hiện tại của bạn:',
//             cart: cartWithImages,
//             status: 'success'
//         });
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// };











// deleteCartProduct , getCart


module.exports = {
    postcartProducts
};
