const { Enrollment, User, Course, Classroom } = require('../models');

const getAllEnrollments = async (query) => {
  const { student_id, course_id, status, limit = 10, offset = 0 } = query;
  let whereClause = {};
  if (student_id) whereClause.student_id = student_id;
  if (course_id) whereClause.course_id = course_id;
  if (status) whereClause.status = status;

  const enrollments = await Enrollment.findAndCountAll({
    where: whereClause,
    include: [
      { association: 'student', attributes: ['id', 'username'] },
      { association: 'course', attributes: ['id', 'name'] },
      { association: 'classroom', attributes: ['id', 'name'] }
    ],
    limit: parseInt(limit), offset: parseInt(offset), order: [['created_at', 'DESC']]
  });

  return {
    error: false, status: 200, message: 'Thành công', data: enrollments.rows,
    pagination: { total: enrollments.count, limit: parseInt(limit), offset: parseInt(offset) }
  };
};

const getEnrollmentById = async (id) => {
  const enrollment = await Enrollment.findByPk(id, {
    include: [
      { association: 'student', attributes: ['id', 'username'] },
      { association: 'course', attributes: ['id', 'name'] },
      { association: 'classroom', attributes: ['id', 'name'] }
    ]
  });
  if (!enrollment) return { error: true, status: 404, message: 'Ghi danh không tồn tại' };
  return { error: false, status: 200, message: 'Thành công', data: enrollment };
};

const createEnrollment = async (data) => {
  const { student_id, course_id, class_id } = data;
  if (!student_id || !course_id) return { error: true, status: 400, message: 'student_id và course_id là bắt buộc' };

  if (!(await User.findByPk(student_id))) return { error: true, status: 404, message: 'Học viên không tồn tại' };
  if (!(await Course.findByPk(course_id))) return { error: true, status: 404, message: 'Khóa học không tồn tại' };
  
  if (class_id && !(await Classroom.findByPk(class_id))) {
    return { error: true, status: 404, message: 'Lớp học không tồn tại' };
  }

  const existing = await Enrollment.findOne({ where: { student_id, course_id } });
  if (existing) return { error: true, status: 409, message: 'Học viên đã ghi danh khóa học này rồi' };

  const enrollment = await Enrollment.create({ student_id, course_id, class_id: class_id || null, status: 'PENDING' });
  return { error: false, status: 201, message: 'Tạo ghi danh thành công', data: enrollment };
};

const updateEnrollment = async (id, data) => {
  const enrollment = await Enrollment.findByPk(id);
  if (!enrollment) return { error: true, status: 404, message: 'Ghi danh không tồn tại' };

  if (data.class_id && !(await Classroom.findByPk(data.class_id))) {
    return { error: true, status: 404, message: 'Lớp học không tồn tại' };
  }

  await enrollment.update({
    class_id: data.class_id !== undefined ? data.class_id : enrollment.class_id,
    status: data.status || enrollment.status
  });
  return { error: false, status: 200, message: 'Cập nhật ghi danh thành công', data: enrollment };
};

const deleteEnrollment = async (id) => {
  const enrollment = await Enrollment.findByPk(id);
  if (!enrollment) return { error: true, status: 404, message: 'Ghi danh không tồn tại' };
  await enrollment.destroy();
  return { error: false, status: 200, message: 'Xóa ghi danh thành công' };
};

module.exports = { getAllEnrollments, getEnrollmentById, createEnrollment, updateEnrollment, deleteEnrollment };