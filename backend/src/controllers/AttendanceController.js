const AttendanceService = require('../services/AttendanceService');
const catchAsync = require('../utils/catchAsync');
const { sendSuccess, sendError } = require('../utils/responseHelper');

const getAllAttendances = catchAsync(async (req, res) => {
  const result = await AttendanceService.getAllAttendances(req.query);
  return sendSuccess(res, result.status, result.message, result.data, result.pagination);
});

const getAttendanceById = catchAsync(async (req, res) => {
  const result = await AttendanceService.getAttendanceById(req.params.id);
  if (result.error) return sendError(res, result.status, result.message);
  return sendSuccess(res, result.status, result.message, result.data);
});

const createAttendance = catchAsync(async (req, res) => {
  const result = await AttendanceService.createAttendance(req.body);
  if (result.error) return sendError(res, result.status, result.message);
  return sendSuccess(res, result.status, result.message, result.data);
});

const updateAttendance = catchAsync(async (req, res) => {
  const result = await AttendanceService.updateAttendance(req.params.id, req.body);
  if (result.error) return sendError(res, result.status, result.message);
  return sendSuccess(res, result.status, result.message, result.data);
});

const deleteAttendance = catchAsync(async (req, res) => {
  const result = await AttendanceService.deleteAttendance(req.params.id);
  if (result.error) return sendError(res, result.status, result.message);
  return sendSuccess(res, result.status, result.message);
});

module.exports = { getAllAttendances, getAttendanceById, createAttendance, updateAttendance, deleteAttendance };