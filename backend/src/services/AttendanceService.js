const { Attendance, Classroom, User } = require('../models');

const getAllAttendances = async (query) => {
  const { class_id, student_id, status, limit = 10, offset = 0 } = query;
  let whereClause = {};
  if (class_id) whereClause.class_id = class_id;
  if (student_id) whereClause.student_id = student_id;
  if (status) whereClause.status = status;

  const attendances = await Attendance.findAndCountAll({
    where: whereClause,
    include: [
      { association: 'classroom', attributes: ['id', 'name'] },
      { association: 'student', attributes: ['id', 'username'] }
    ],
    limit: parseInt(limit),
    offset: parseInt(offset),
    order: [['attendance_date', 'DESC']]
  });

  return {
    error: false, status: 200, message: 'Lấy danh sách điểm danh thành công',
    data: attendances.rows,
    pagination: { total: attendances.count, limit: parseInt(limit), offset: parseInt(offset) }
  };
};

const getAttendanceById = async (id) => {
  const attendance = await Attendance.findByPk(id, {
    include: [
      { association: 'classroom', attributes: ['id', 'name'] },
      { association: 'student', attributes: ['id', 'username'] }
    ]
  });
  if (!attendance) return { error: true, status: 404, message: 'Điểm danh không tồn tại' };
  return { error: false, status: 200, message: 'Thành công', data: attendance };
};

const createAttendance = async (data) => {
  const { class_id, student_id, attendance_date, status, note } = data;
  if (!class_id || !student_id || !attendance_date || !status) {
    return { error: true, status: 400, message: 'class_id, student_id, attendance_date, status là bắt buộc' };
  }

  if (!(await Classroom.findByPk(class_id))) return { error: true, status: 404, message: 'Lớp học không tồn tại' };
  if (!(await User.findByPk(student_id))) return { error: true, status: 404, message: 'Học viên không tồn tại' };

  const existing = await Attendance.findOne({ where: { class_id, student_id, attendance_date } });
  if (existing) return { error: true, status: 409, message: 'Điểm danh cho ngày này đã tồn tại' };

  const attendance = await Attendance.create({ class_id, student_id, attendance_date, status, note });
  return { error: false, status: 201, message: 'Tạo điểm danh thành công', data: attendance };
};

const updateAttendance = async (id, data) => {
  const attendance = await Attendance.findByPk(id);
  if (!attendance) return { error: true, status: 404, message: 'Điểm danh không tồn tại' };

  await attendance.update({ status: data.status || attendance.status, note: data.note || attendance.note });
  return { error: false, status: 200, message: 'Cập nhật điểm danh thành công', data: attendance };
};

const deleteAttendance = async (id) => {
  const attendance = await Attendance.findByPk(id);
  if (!attendance) return { error: true, status: 404, message: 'Điểm danh không tồn tại' };
  await attendance.destroy();
  return { error: false, status: 200, message: 'Xóa điểm danh thành công' };
};

module.exports = { getAllAttendances, getAttendanceById, createAttendance, updateAttendance, deleteAttendance };