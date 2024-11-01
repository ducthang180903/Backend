const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Đường dẫn đến thư mục lưu trữ
const uploadPath = path.join(__dirname, '../uploads/imgs/');

// Kiểm tra và tạo thư mục nếu nó không tồn tại
if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true }); // Tạo thư mục và các thư mục cha nếu cần
}

// Cấu hình lưu trữ
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadPath); // Thư mục lưu trữ hình ảnh
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '_' + file.originalname); // Đặt tên file
    }
});

// Khởi tạo multer
const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        const allowedTypes = ["image/png", "image/jpg", "image/jpeg", "image/gif"];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Chỉ chấp nhận tập tin hình ảnh PNG, GIF, JPG hoặc JPEG.')); // Gọi cb với lỗi
        }
    },
    limits: { fileSize: 5 * 1024 * 1024 } // 5 MB
}).single('HinhAnh'); // Sử dụng single để upload 1 file

module.exports = upload;