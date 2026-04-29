const EnrollmentService = require('../services/EnrollmentService');
const catchAsync = require('../utils/catchAsync');
const { sendSuccess, sendError } = require('../utils/responseHelper');

const getAllEnrollments = catchAsync(async (req, res) => {
  const result = await EnrollmentService.getAllEnrollments(req.query);
  return sendSuccess(res, result.status, result.message, result.data, result.pagination);
});

const getEnrollmentById = catchAsync(async (req, res) => {
  const result = await EnrollmentService.getEnrollmentById(req.params.id);
  if (result.error) return sendError(res, result.status, result.message);
  return sendSuccess(res, result.status, result.message, result.data);
});

const createEnrollment = catchAsync(async (req, res) => {
  const result = await EnrollmentService.createEnrollment(req.body);
  if (result.error) return sendError(res, result.status, result.message);
  return sendSuccess(res, result.status, result.message, result.data);
});

const updateEnrollment = catchAsync(async (req, res) => {
  const result = await EnrollmentService.updateEnrollment(req.params.id, req.body);
  if (result.error) return sendError(res, result.status, result.message);
  return sendSuccess(res, result.status, result.message, result.data);
});

const deleteEnrollment = catchAsync(async (req, res) => {
  const result = await EnrollmentService.deleteEnrollment(req.params.id);
  if (result.error) return sendError(res, result.status, result.message);
  return sendSuccess(res, result.status, result.message);
});

module.exports = { getAllEnrollments, getEnrollmentById, createEnrollment, updateEnrollment, deleteEnrollment };