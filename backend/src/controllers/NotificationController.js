const NotificationService = require('../services/NotificationService');
const catchAsync = require('../utils/catchAsync');
const { sendSuccess, sendError } = require('../utils/responseHelper');

const getAllNotifications = catchAsync(async (req, res) => {
  const result = await NotificationService.getAllNotifications(req.query);
  return sendSuccess(res, result.status, result.message, result.data, result.pagination);
});

const getNotificationById = catchAsync(async (req, res) => {
  const result = await NotificationService.getNotificationById(req.params.id);
  if (result.error) return sendError(res, result.status, result.message);
  return sendSuccess(res, result.status, result.message, result.data);
});

const createNotification = catchAsync(async (req, res) => {
  const result = await NotificationService.createNotification(req.body, req.user?.id);
  if (result.error) return sendError(res, result.status, result.message);
  return sendSuccess(res, result.status, result.message, result.data);
});

const updateNotification = catchAsync(async (req, res) => {
  const result = await NotificationService.updateNotification(req.params.id, req.body);
  if (result.error) return sendError(res, result.status, result.message);
  return sendSuccess(res, result.status, result.message, result.data);
});

const deleteNotification = catchAsync(async (req, res) => {
  const result = await NotificationService.deleteNotification(req.params.id);
  if (result.error) return sendError(res, result.status, result.message);
  return sendSuccess(res, result.status, result.message);
});

const getUserNotifications = catchAsync(async (req, res) => {
  const result = await NotificationService.getUserNotifications(req.user?.id, req.query);
  if (result.error) return sendError(res, result.status, result.message);
  return sendSuccess(res, result.status, result.message, result.data, result.pagination);
});

const markAsRead = catchAsync(async (req, res) => {
  const result = await NotificationService.markAsRead(req.user?.id, req.params.notificationId);
  if (result.error) return sendError(res, result.status, result.message);
  return sendSuccess(res, result.status, result.message, result.data);
});

module.exports = { getAllNotifications, getNotificationById, createNotification, updateNotification, deleteNotification, getUserNotifications, markAsRead };