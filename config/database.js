// // config/database.js

// const mysql = require('mysql2/promise'); // Sử dụng mysql2/promise

// // Tạo pool kết nối với cơ sở dữ liệu MySQL
// const pool = mysql.createPool({
//     host: process.env.DB_HOST || 'localhost',      // Địa chỉ host của cơ sở dữ liệu
//     user: process.env.DB_USER || 'root',           // Tên người dùng
//     password: process.env.DB_PASSWORD || '',        // Mật khẩu (trống nếu không có)
//     database: process.env.DB_NAME || 'nongsan1',     // Tên cơ sở dữ liệu
//     waitForConnections: true,                        // Chờ các kết nối
//     connectionLimit: 10,                            // Giới hạn số kết nối
//     queueLimit: 0                                    // Giới hạn số yêu cầu trong hàng đợi
// });

// // Kiểm tra kết nối với cơ sở dữ liệu
// const checkConnection = async () => {
//     try {
//         // Thực hiện một truy vấn đơn giản để kiểm tra kết nối
//         await pool.query('SELECT 1');
//         console.log('Kết nối thành công với cơ sở dữ liệu MySQL!');
//     } catch (err) {
//         console.error('Lỗi kết nối cơ sở dữ liệu: ', err);
//     }
// };

// // Gọi hàm kiểm tra kết nối
// checkConnection();

// // Xuất pool kết nối để sử dụng ở nơi khác
// module.exports = pool;
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(process.env.DB_NAME  || 'nongsan1' , process.env.DB_USER || 'root' , process.env.DB_PASSWORD || '', {
  host: process.env.DB_HOST,
  dialect: 'mysql',
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
});

sequelize
  .authenticate()
  .then(() => console.log('Connected to MySQL successfully!'))
  .catch((error) => console.error('Unable to connect to MySQL:', error));

module.exports = sequelize;
