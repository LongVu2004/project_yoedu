const { Sequelize } = require('sequelize');

// Khởi tạo Sequelize dựa trên các biến môi trường
const sequelize = new Sequelize(
  process.env.DB_NAME, 
  process.env.DB_USER, 
  process.env.DB_PASSWORD, 
  {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT || 'mysql',
    logging: false, // Đặt là true nếu bạn muốn xem câu lệnh SQL in ra terminal
    pool: {
      max: 5,       // Số kết nối tối đa
      min: 0,       // Số kết nối tối thiểu
      acquire: 30000, // Thời gian tối đa (ms) để kết nối trước khi văng lỗi
      idle: 10000   // Thời gian tối đa (ms) kết nối rảnh rỗi trước khi bị đóng
    }
  }
);

module.exports = sequelize;