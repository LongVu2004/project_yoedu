const GradeService = require('../services/GradeService');
const catchAsync = require('../utils/catchAsync');
const { sendSuccess, sendError } = require('../utils/responseHelper');

const getAllGrades = catchAsync(async (req, res) => {
  const result = await GradeService.getAllGrades(req.query);
  return sendSuccess(res, result.status, result.message, result.data, result.pagination);
});

const getGradeById = catchAsync(async (req, res) => {
  const result = await GradeService.getGradeById(req.params.id);
  if (result.error) return sendError(res, result.status, result.message);
  return sendSuccess(res, result.status, result.message, result.data);
});

const createGrade = catchAsync(async (req, res) => {
  const result = await GradeService.createGrade(req.body);
  if (result.error) return sendError(res, result.status, result.message);
  return sendSuccess(res, result.status, result.message, result.data);
});

const updateGrade = catchAsync(async (req, res) => {
  const result = await GradeService.updateGrade(req.params.id, req.body);
  if (result.error) return sendError(res, result.status, result.message);
  return sendSuccess(res, result.status, result.message, result.data);
});

const deleteGrade = catchAsync(async (req, res) => {
  const result = await GradeService.deleteGrade(req.params.id);
  if (result.error) return sendError(res, result.status, result.message);
  return sendSuccess(res, result.status, result.message);
});

module.exports = { getAllGrades, getGradeById, createGrade, updateGrade, deleteGrade };