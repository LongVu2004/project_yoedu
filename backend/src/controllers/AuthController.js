const AuthService = require('../services/AuthService');
const catchAsync = require('../utils/catchAsync');
const { sendSuccess, sendError } = require('../utils/responseHelper');

const register = catchAsync(async (req, res) => {
  const result = await AuthService.register(req.body);
  if (result.error) return sendError(res, result.status, result.message);
  return sendSuccess(res, result.status, result.message, result.data);
});

const login = catchAsync(async (req, res) => {
  const result = await AuthService.login(req.body);
  if (result.error) return sendError(res, result.status, result.message);
  return sendSuccess(res, result.status, result.message, result.data);
});

const refreshToken = catchAsync(async (req, res) => {
  const result = await AuthService.refreshToken(req.body.refreshToken);
  if (result.error) return sendError(res, result.status, result.message);
  return sendSuccess(res, result.status, result.message, result.data);
});

module.exports = { register, login, refreshToken };