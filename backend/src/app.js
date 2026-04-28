require('dotenv').config();
const express = require('express');
const sequelize = require('./config/database');
const corsMiddleware = require('./middlewares/corsMiddleware');

// Import routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const courseRoutes = require('./routes/courseRoutes');
const classroomRoutes = require('./routes/classroomRoutes');
const enrollmentRoutes = require('./routes/enrollmentRoutes');
const attendanceRoutes = require('./routes/attendanceRoutes');
const gradeRoutes = require('./routes/gradeRoutes');
const invoiceRoutes = require('./routes/invoiceRoutes');
const notificationRoutes = require('./routes/notificationRoutes');

// Import models
require('./models');

const app = express();

// ============== MIDDLEWARE ==============
// CORS
app.use(corsMiddleware);

// Body Parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ============== DATABASE CONNECTION ==============
let dbConnected = false;

const connectDatabase = async (retries = 5) => {
  for (let i = 0; i < retries; i++) {
    try {
      await sequelize.authenticate();
      console.log('✅ Sequelize đã kết nối thành công với MySQL (yoedu_db)!');
      
      // Sync models với database (tạo table nếu chưa có)
      await sequelize.sync({ alter: false });
      console.log('✅ Tất cả các model đã được đồng bộ với database!');
      
      dbConnected = true;
      return;
    } catch (err) {
      console.log(`❌ Lần kết nối thứ ${i + 1} thất bại. Đang thử lại trong 2 giây...`);
      console.error(err.message);
      if (i < retries - 1) {
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }
  }
  console.error('❌ Không thể kết nối database sau ' + retries + ' lần thử');
};

connectDatabase();

// ============== HEALTH CHECK ==============
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'YOEDU Backend is healthy!',
    timestamp: new Date().toISOString()
  });
});

// ============== API ROUTES ==============
// Auth routes
app.use('/api/auth', authRoutes);

// Protected routes
app.use('/api/users', userRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/classrooms', classroomRoutes);
app.use('/api/enrollments', enrollmentRoutes);
app.use('/api/attendances', attendanceRoutes);
app.use('/api/grades', gradeRoutes);
app.use('/api/invoices', invoiceRoutes);
app.use('/api/notifications', notificationRoutes);

// ============== ERROR HANDLING ==============
// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route không tồn tại'
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('❌ Error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Lỗi máy chủ',
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
});

// ============== START SERVER ==============
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 YOEDU Backend đang chạy tại cổng ${PORT}`);
  console.log(`📡 Environment: ${process.env.NODE_ENV || 'development'}`);
});