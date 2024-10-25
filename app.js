const express = require('express');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session); // Đảm bảo dùng express-mysql-session
const pool = require('./config/database'); // Kết nối tới MySQL pool
require('dotenv').config();




const errorMiddleware = require('./middlewares/errorMiddleware');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cấu hình MySQL session store
const sessionStore = new MySQLStore({}, pool); // Sử dụng MySQL pool

// Cấu hình session
app.use(session({
    key: process.env.SESSION_COOKIE_NAME || 'session_cookie_name',
    secret: process.env.SESSION_SECRET || 'mysecretkey',
    store: sessionStore,  // Sử dụng express-mysql-session
    resave: false,
    saveUninitialized: false,
    cookie: { 
        secure: false, // Đặt thành true nếu dùng HTTPS
        maxAge: 24 * 60 * 60 * 1000 // 24 giờ
    }
}));




// Nạp route của người dùng
const userRoutes = require('./routes/userRoutes');
app.use('/api', userRoutes);
// Nạp route của loai SP
const producttypeRoutes = require('./routes/producttypeRoutes');
app.use('/api', producttypeRoutes);
// Nạp route của sanpham
const productRoutes0 = require('./routes/productRoutes');
app.use('/api', productRoutes0);
// Nạp route của kho
const warehouseRoutes = require('./routes/warehouseRoutes');
app.use('/api', warehouseRoutes);
// Nạp route của kho
const cartRouter = require('./routes/cartRoutes');
app.use('/api', cartRouter);

// Route mẫu
app.get('/', (req, res) => {
  res.send('Xin chào, đây là server Node.js của bạn!');
});

app.use(errorMiddleware);
module.exports = app;
