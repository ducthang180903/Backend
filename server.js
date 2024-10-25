// server.js
const express = require('express');
const session = require('express-session');
const app = require('./app');
const sequelize = require('./config/database');
const User = require('./models/userModel'); // Đường dẫn đúng đến file mô hình của bạn

// Đặt cổng từ biến môi trường hoặc sử dụng mặc định là 3000
const PORT = process.env.PORT || 3001;



app.use(express.json());
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

// sequelize.sync().then(() => {
//   app.listen(PORT, () => {
//     console.log(`Server is running on port ${PORT}`);
//   });
// });
// Kiểm tra kết nối cơ sở dữ liệu
sequelize.authenticate()
  .then(() => {
    console.log('Kết nối đến cơ sở dữ liệu thành công!');
    
    // Bắt đầu server
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('Không thể kết nối đến cơ sở dữ liệu:', err);
  });

