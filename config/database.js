const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(process.env.DB_NAME || 'nongsan1', process.env.DB_USER || 'root', process.env.DB_PASSWORD || '', {
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
  .then(() => console.log('Kết nối đến cơ sở dữ liệu thành công!'))
  .catch((error) => console.log('Không thể kết nối đến cơ sở dữ liệu:', error));

module.exports = sequelize;
