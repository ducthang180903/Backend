const jwt = require("jsonwebtoken");
const User = require("../models/userModel");


const verifyToken = (token) => {
    try {
        return jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
        return null;
    }
}
const checkLogin = (req, res, next) => {
    const tokenUser = req.session.user;
    if (tokenUser) {
        const decodedToken = verifyToken(tokenUser);
        // console.log('check token: ', token);

        if (!decodedToken) {
            res.status(404).json({ warning: 'Token không hợp lệ!' });
            return;
        }

        req.user = decodedToken;
        // console.log('check user token: ', req.user);
        next();
    } else {
        return res.status(404).json({ warning: 'Bạn chưa đăng nhập!' });
    }
}

const checkRole = (requiredRoles) => async (req, res, next) => {
    const userID = req.session.user;
    if (!userID) {
        return res.status(404).json({ error: 'Bạn chưa đăng nhập.' });
    }
    try {
        const data = verifyToken(userID)
        // return res.json({ message: 'check >>>>>>>>>>>>>>>>>>>:', data });

        const user = await User.findByPk(data.id, { attributes: ['NguoiDungId', 'VaiTro'] });
        // return res.json({ message: 'check >>>>>>>>>>>>>>>>>>>:', user });

        if (!user) {
            return res.status(404).json({ error: 'Người dùng không tồn tại.' });
        }

        if (requiredRoles.includes(user.VaiTro)) {
            return next();
        } else {
            return res.status(403).json({ warning: 'Bạn không có quyền truy cập!' });
        }
    } catch (error) {
        console.error('Lỗi kiểm tra quyền hạn:', error);
        return res.status(500).json({ error: 'Lỗi kiểm tra quyền hạn.' });
    }
};

const isAdmin = checkRole(['admin']);
const isManager = checkRole(['quanly', 'admin']);

module.exports = {
    verifyToken,
    checkLogin,
    isAdmin,
    isManager
}