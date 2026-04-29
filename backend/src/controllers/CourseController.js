const CourseService = require('../services/CourseService');
const catchAsync = require('../utils/catchAsync');
const { sendSuccess, sendError } = require('../utils/responseHelper');

const getAllCourses = catchAsync(async (req, res) => {
  const result = await CourseService.getAllCourses(req.query);
  return sendSuccess(res, result.status, result.message, result.data, result.pagination);
});

const getCourseById = catchAsync(async (req, res) => {
  const result = await CourseService.getCourseById(req.params.id);
  if (result.error) return sendError(res, result.status, result.message);
  return sendSuccess(res, result.status, result.message, result.data);
});

const createCourse = catchAsync(async (req, res) => {
  const result = await CourseService.createCourse(req.body);
  if (result.error) return sendError(res, result.status, result.message);
  return sendSuccess(res, result.status, result.message, result.data);
});

const updateCourse = catchAsync(async (req, res) => {
  const result = await CourseService.updateCourse(req.params.id, req.body);
  if (result.error) return sendError(res, result.status, result.message);
  return sendSuccess(res, result.status, result.message, result.data);
});

const deleteCourse = catchAsync(async (req, res) => {
  const result = await CourseService.deleteCourse(req.params.id);
  if (result.error) return sendError(res, result.status, result.message);
  return sendSuccess(res, result.status, result.message);
});

module.exports = { getAllCourses, getCourseById, createCourse, updateCourse, deleteCourse };