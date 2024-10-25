require('dotenv').config();
const express = require('express');
const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const sequelize = require('./config/database'); // Kết nối tới Sequelize instance
const errorMiddleware = require('./middlewares/errorMiddleware');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cấu hình Sequelize session store
const store = new SequelizeStore({
    db: sequelize, // Sử dụng Sequelize instance
});

// Cấu hình session
app.use(session({
    secret: process.env.SESSION_SECRET || 'mysecretkey',
    store: store, // Sử dụng SequelizeStore
    resave: false,
    saveUninitialized: false,
    cookie: { 
        secure: false, // Đặt thành true nếu dùng HTTPS
        maxAge: 24 * 60 * 60 * 1000 // 24 giờ
    }
}));

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
