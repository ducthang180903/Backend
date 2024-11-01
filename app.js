require('dotenv').config();
const cors = require('cors');
const express = require('express');
const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const sequelize = require('./config/database'); // Kết nối tới Sequelize instance
const errorMiddleware = require('./middlewares/errorMiddleware');
const assignSessionId = require('./middlewares/assignSession');
const path = require('path');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const sessionStore = new SequelizeStore({
  db: sequelize, // Sử dụng kết nối sequelize
});

// Cấu hình CORS
const corsOptions = {
  origin: process.env.CORS, // Địa chỉ frontend cho phép, ví dụ: 'http://localhost:3000'
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Các phương thức được phép
  allowedHeaders: ['Content-Type', 'Authorization'], // Các tiêu đề được phép
  credentials: true, // Cho phép gửi cookie và thông tin xác thực khác
  optionsSuccessStatus: 200 // Một số trình duyệt cũ gặp vấn đề với 204
};

app.use(cors(corsOptions)); // Sử dụng CORS cho toàn bộ ứng dụng
app.use('/api', express.static(path.join(__dirname, 'uploads')));

// Cấu hình Sequelize session store
const store = new SequelizeStore({
  db: sequelize, // Sử dụng Sequelize instance
});

// Cấu hình middleware cho session
app.use(session({
  secret: 'mysecretkey', // Khóa bí mật của bạn
  store: sessionStore, // Sử dụng SequelizeStore để lưu session vào cơ sở dữ liệu
  resave: false, // Không lưu lại session nếu không có thay đổi
  saveUninitialized: false, // Không lưu session chưa khởi tạo
  cookie: {
    maxAge: 1000 * 60 * 30, // Thời gian sống của cookie (30 phút)
    httpOnly: true, // Chỉ cho phép cookie được truy cập bởi HTTP
    secure: process.env.NODE_ENV === 'production', // Chỉ sử dụng cookie secure trong môi trường sản xuất
  }
}));
sessionStore.sync();
app.use(assignSessionId);

// Khởi tạo bảng session (nếu chưa có)
store.sync();

// Nạp route của người dùng
const userRoutes = require('./routes/userRoutes');
app.use('/api', userRoutes);

// Nạp route của loại sản phẩm
const producttypeRoutes = require('./routes/producttypeRoutes');
app.use('/api', producttypeRoutes);

// Nạp route của sản phẩm
const productRoutes0 = require('./routes/productRoutes');
app.use('/api', productRoutes0);

// Nạp route của kho
const warehouseRoutes = require('./routes/warehouseRoutes');
app.use('/api', warehouseRoutes);

// Nạp route của giỏ hàng
const cartRouter = require('./routes/cartRoutes');
app.use('/api', cartRouter);

// Route mẫu
app.get('/', (req, res) => {
  res.send('Xin chào, đây là server Node.js của bạn!');
});

app.use(errorMiddleware);

module.exports = app;
