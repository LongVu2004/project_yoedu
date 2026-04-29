const { sendError } = require('./responseHelper');

const catchAsync = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch((err) => {
      console.error('System Error:', err);
      // Bắt các lỗi 500 unhandled và ném ra response chuẩn
      sendError(res, 500, 'Lỗi hệ thống hoặc Database', err.message);
    });
  };
};

module.exports = catchAsync;