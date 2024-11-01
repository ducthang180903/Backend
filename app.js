const express = require('express');
const app = express();
const cors = require('cors');
const cookieParser = require("cookie-parser");
const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const sequelize = require('./config/database'); // Kết nối tới Sequelize instance
const errorMiddleware = require('./middlewares/errorMiddleware');
const assignSessionId = require('./middlewares/assignSession');
const path = require('path');
const apiRouter = require('./routes/apiRouter');
const cartRouter = require('./routes/cartRoutes');
const warehouseRoutes = require('./routes/warehouseRoutes');
const PORT = process.env.PORT || 8000;
require('./config/database');
require('dotenv').config();

const store = new SequelizeStore({
  db: sequelize, // Sử dụng Sequelize instance
});


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
app.use('/api', express.static(path.join(__dirname, 'uploads/imgs/')));
app.use('/api', apiRouter);
app.use('/api', cartRouter);
app.use(errorMiddleware);

app.use(cookieParser());
app.use(session({
  name: 'SSID',
  secret: process.env.KEY_SESSION, // Khóa bí mật của bạn
  store: sessionStore, // Sử dụng SequelizeStore để lưu session vào cơ sở dữ liệu
  resave: false, // Không lưu lại session nếu không có thay đổi
  saveUninitialized: false, // Không lưu session chưa khởi tạo
  cookie: {
    secure: false,
    httpOnly: true, // Chỉ cho phép cookie được truy cập bởi HTTP
    maxAge: 1000 * 60 * 30, // Thời gian sống của cookie (30 phút)
  }
}));

sessionStore.sync();
app.use(assignSessionId);

// Khởi tạo bảng session (nếu chưa có)
store.sync();

// Nạp route của kh
app.use('/api', warehouseRoutes);

app.get('/', (req, res) => {
  res.send('Xin chào, đây là server Node.js của bạn!');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


module.exports = app;
