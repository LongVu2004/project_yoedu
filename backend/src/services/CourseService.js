const { Course } = require('../models');

const getAllCourses = async (query) => {
  const { status, limit = 10, offset = 0 } = query;
  let whereClause = {};
  if (status) whereClause.status = status;

  const courses = await Course.findAndCountAll({
    where: whereClause, limit: parseInt(limit), offset: parseInt(offset), order: [['created_at', 'DESC']]
  });

  return {
    error: false, status: 200, message: 'Thành công', data: courses.rows,
    pagination: { total: courses.count, limit: parseInt(limit), offset: parseInt(offset) }
  };
};

const getCourseById = async (id) => {
  const course = await Course.findByPk(id, { include: { association: 'classrooms' } });
  if (!course) return { error: true, status: 404, message: 'Khóa học không tồn tại' };
  return { error: false, status: 200, message: 'Thành công', data: course };
};

const createCourse = async (data) => {
  if (!data.name) return { error: true, status: 400, message: 'Tên khóa học là bắt buộc' };
  const course = await Course.create({
    name: data.name, description: data.description,
    tuition_fee: data.tuition_fee || 0, status: data.status || 'ACTIVE'
  });
  return { error: false, status: 201, message: 'Tạo khóa học thành công', data: course };
};

const updateCourse = async (id, data) => {
  const course = await Course.findByPk(id);
  if (!course) return { error: true, status: 404, message: 'Khóa học không tồn tại' };
  await course.update({
    name: data.name || course.name, description: data.description || course.description,
    tuition_fee: data.tuition_fee !== undefined ? data.tuition_fee : course.tuition_fee,
    status: data.status || course.status
  });
  return { error: false, status: 200, message: 'Cập nhật khóa học thành công', data: course };
};

const deleteCourse = async (id) => {
  const course = await Course.findByPk(id);
  if (!course) return { error: true, status: 404, message: 'Khóa học không tồn tại' };
  await course.destroy();
  return { error: false, status: 200, message: 'Xóa khóa học thành công' };
};

module.exports = { getAllCourses, getCourseById, createCourse, updateCourse, deleteCourse };