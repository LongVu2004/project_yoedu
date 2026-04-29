const cors = require('cors');

const corsOptions = {
  origin: function (origin, callback) {
    // 1. Khai báo danh sách các domain được phép
    let whitelist = [];

    // 2. Nếu đang ở môi trường dev, thêm localhost vào whitelist
    if (process.env.NODE_ENV !== 'production') {
      whitelist = [
        'http://localhost:3000',
        'http://localhost:5173',
        'http://localhost:8080',
        'http://127.0.0.1:3000',
        'http://127.0.0.1:5173'
      ];
    }

    // 3. Lấy URL production từ .env (hỗ trợ nhiều URL cách nhau bằng dấu phẩy)
    // Ví dụ trong file .env: FRONTEND_URL=https://yoedu.com,https://admin.yoedu.com
    if (process.env.FRONTEND_URL) {
      const envOrigins = process.env.FRONTEND_URL.split(',').map(url => url.trim());
      whitelist = whitelist.concat(envOrigins);
    }

    // 4. Kiểm tra Origin
    // !origin cho phép các request không có origin (ví dụ: Postman, Mobile App, CURL) qua được.
    // Nếu bạn làm API chỉ thuần cho Web, bạn có thể bỏ `!origin` đi để siết chặt bảo mật.
    if (!origin || whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error(`CORS policy does not allow access from origin: ${origin}`));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 200,
  maxAge: 3600
};

module.exports = cors(corsOptions);