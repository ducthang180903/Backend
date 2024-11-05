const { verifyToken } = require('../config/jwt'); // Giả sử verifyToken là một hàm bạn đã định nghĩa để xác thực token

const authMiddleware = (req, res, next) => {
    const token = req.cookies.ss_account; // Lấy token từ cookie

    // Kiểm tra nếu không có token
    if (!token) {
        return res.status(401).json({ message: 'Không có token, bạn cần đăng nhập.' });
    }

    try {
        // Giải mã token
        const decoded = verifyToken(token); 
        // Lưu thông tin người dùng vào req
        req.user = {
            NguoiDungId: decoded.id, // Giả sử id trong token là NguoiDungId
            Account: decoded.Account, // Giả sử Account cũng được lưu trong token
        };

        next(); // Tiếp tục đến middleware hoặc route tiếp theo
    } catch (error) {
        console.error('Lỗi khi giải mã token:', error);
        return res.status(401).json({ loggedIn: false, message: 'Token không hợp lệ hoặc đã hết hạn.' });
    }
};

module.exports = authMiddleware;
