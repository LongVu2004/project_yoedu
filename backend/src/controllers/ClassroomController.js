const ClassroomService = require('../services/ClassroomService');
const catchAsync = require('../utils/catchAsync');
const { sendSuccess, sendError } = require('../utils/responseHelper');

const getAllClassrooms = catchAsync(async (req, res) => {
  const result = await ClassroomService.getAllClassrooms(req.query);
  return sendSuccess(res, result.status, result.message, result.data, result.pagination);
});

const getClassroomById = catchAsync(async (req, res) => {
  const result = await ClassroomService.getClassroomById(req.params.id);
  if (result.error) return sendError(res, result.status, result.message);
  return sendSuccess(res, result.status, result.message, result.data);
});

const createClassroom = catchAsync(async (req, res) => {
  const result = await ClassroomService.createClassroom(req.body);
  if (result.error) return sendError(res, result.status, result.message);
  return sendSuccess(res, result.status, result.message, result.data);
});

const updateClassroom = catchAsync(async (req, res) => {
  const result = await ClassroomService.updateClassroom(req.params.id, req.body);
  if (result.error) return sendError(res, result.status, result.message);
  return sendSuccess(res, result.status, result.message, result.data);
});

const deleteClassroom = catchAsync(async (req, res) => {
  const result = await ClassroomService.deleteClassroom(req.params.id);
  if (result.error) return sendError(res, result.status, result.message);
  return sendSuccess(res, result.status, result.message);
});

module.exports = { getAllClassrooms, getClassroomById, createClassroom, updateClassroom, deleteClassroom };