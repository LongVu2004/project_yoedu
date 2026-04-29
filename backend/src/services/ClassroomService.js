const { Classroom, Course, User, ScheduleTemplate } = require('../models');

const getAllClassrooms = async (query) => {
  const { course_id, status, limit = 10, offset = 0 } = query;
  let whereClause = {};
  if (course_id) whereClause.course_id = course_id;
  if (status) whereClause.status = status;

  const classrooms = await Classroom.findAndCountAll({
    where: whereClause,
    include: [
      { association: 'course', attributes: ['id', 'name'] },
      { association: 'teacher', attributes: ['id', 'username'] },
      { association: 'schedule', attributes: ['id', 'name', 'days_of_week', 'start_time', 'end_time'] }
    ],
    limit: parseInt(limit),
    offset: parseInt(offset),
    order: [['created_at', 'DESC']]
  });

  return {
    error: false, status: 200, message: 'Thành công', data: classrooms.rows,
    pagination: { total: classrooms.count, limit: parseInt(limit), offset: parseInt(offset) }
  };
};

const getClassroomById = async (id) => {
  const classroom = await Classroom.findByPk(id, {
    include: [
      { association: 'course', attributes: ['id', 'name'] },
      { association: 'teacher', attributes: ['id', 'username'] },
      { association: 'schedule' }
    ]
  });
  if (!classroom) return { error: true, status: 404, message: 'Lớp học không tồn tại' };
  return { error: false, status: 200, message: 'Thành công', data: classroom };
};

const createClassroom = async (data) => {
  const { name, course_id, teacher_id, schedule_template_id, room_name, max_students } = data;
  if (!name || !course_id || !teacher_id || !schedule_template_id) {
    return { error: true, status: 400, message: 'name, course_id, teacher_id, schedule_template_id là bắt buộc' };
  }

  if (!(await Course.findByPk(course_id))) return { error: true, status: 404, message: 'Khóa học không tồn tại' };
  if (!(await User.findByPk(teacher_id))) return { error: true, status: 404, message: 'Giáo viên không tồn tại' };
  if (!(await ScheduleTemplate.findByPk(schedule_template_id))) return { error: true, status: 404, message: 'Lịch học không tồn tại' };

  const classroom = await Classroom.create({
    name, course_id, teacher_id, schedule_template_id, room_name,
    max_students: max_students || 20, status: 'OPEN'
  });
  return { error: false, status: 201, message: 'Tạo lớp học thành công', data: classroom };
};

const updateClassroom = async (id, data) => {
  const classroom = await Classroom.findByPk(id);
  if (!classroom) return { error: true, status: 404, message: 'Lớp học không tồn tại' };

  await classroom.update({
    name: data.name || classroom.name,
    room_name: data.room_name || classroom.room_name,
    max_students: data.max_students || classroom.max_students,
    status: data.status || classroom.status
  });
  return { error: false, status: 200, message: 'Cập nhật lớp học thành công', data: classroom };
};

const deleteClassroom = async (id) => {
  const classroom = await Classroom.findByPk(id);
  if (!classroom) return { error: true, status: 404, message: 'Lớp học không tồn tại' };
  await classroom.destroy();
  return { error: false, status: 200, message: 'Xóa lớp học thành công' };
};

module.exports = { getAllClassrooms, getClassroomById, createClassroom, updateClassroom, deleteClassroom };