const sendSuccess = (res, status = 200, message = 'Thành công', data = null, pagination = null) => {
  const response = { success: true, message };
  if (data) response.data = data;
  if (pagination) response.pagination = pagination;
  return res.status(status).json(response);
};

const sendError = (res, status = 500, message = 'Đã xảy ra lỗi', error = null) => {
  const response = { success: false, message };
  if (error) response.error = error;
  return res.status(status).json(response);
};

module.exports = { sendSuccess, sendError };