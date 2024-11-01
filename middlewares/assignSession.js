const { v4: uuidv4 } = require('uuid'); // Sử dụng uuid để tạo SessionId duy nhất

const assignSessionId = (req, res, next) => {
    if (!req.session.user && !req.session.SessionId) {
        // Nếu người dùng chưa đăng nhập và chưa có SessionId, tạo mới SessionId
        req.session.SessionId = uuidv4();
        // console.log("SessionId mới được tạo 123455:", req.session.SessionId);
    }
    next();
};
module.exports = assignSessionId;
