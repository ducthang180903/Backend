// server.js
const express = require('express');
const session = require('express-session');
const app = require('./app');

// Đặt cổng từ biến môi trường hoặc sử dụng mặc định là 3000
const PORT = process.env.PORT || 3000;



app.use(express.json());
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

// Khởi động server
app.listen(PORT, () => {
  console.log(`Server đang chạy trên cổng ${PORT}`);
});
