const UserService = require('../services/UserService');
const catchAsync = require('../utils/catchAsync');
const { sendSuccess, sendError } = require('../utils/responseHelper');

const getAllUsers = catchAsync(async (req, res) => {
  const result = await UserService.getAllUsers(req.query);
  return sendSuccess(res, result.status, result.message, result.data, result.pagination);
});

const getUserById = catchAsync(async (req, res) => {
  const result = await UserService.getUserById(req.params.id);
  if (result.error) return sendError(res, result.status, result.message);
  return sendSuccess(res, result.status, result.message, result.data);
});

const updateUser = catchAsync(async (req, res) => {
  const result = await UserService.updateUser(req.params.id, req.body);
  if (result.error) return sendError(res, result.status, result.message);
  return sendSuccess(res, result.status, result.message, result.data);
});

const deleteUser = catchAsync(async (req, res) => {
  const result = await UserService.deleteUser(req.params.id);
  if (result.error) return sendError(res, result.status, result.message);
  return sendSuccess(res, result.status, result.message);
});

const getCurrentUserProfile = catchAsync(async (req, res) => {
  // Lấy ID từ token (đã được authMiddleware gán vào req.user)
  if (!req.user?.id) return sendError(res, 401, 'Không được xác thực');
  const result = await UserService.getUserById(req.user.id);
  if (result.error) return sendError(res, result.status, result.message);
  return sendSuccess(res, result.status, result.message, result.data);
});

module.exports = { getAllUsers, getUserById, updateUser, deleteUser, getCurrentUserProfile };