const { Grade, Classroom, User } = require('../models');

const getAllGrades = async (query) => {
  const { class_id, student_id, limit = 10, offset = 0 } = query;
  let whereClause = {};
  if (class_id) whereClause.class_id = class_id;
  if (student_id) whereClause.student_id = student_id;

  const grades = await Grade.findAndCountAll({
    where: whereClause,
    include: [
      { association: 'classroom', attributes: ['id', 'name'] },
      { association: 'student', attributes: ['id', 'username'] }
    ],
    limit: parseInt(limit), offset: parseInt(offset), order: [['updated_at', 'DESC']]
  });

  return {
    error: false, status: 200, message: 'Thành công', data: grades.rows,
    pagination: { total: grades.count, limit: parseInt(limit), offset: parseInt(offset) }
  };
};

const getGradeById = async (id) => {
  const grade = await Grade.findByPk(id, {
    include: [
      { association: 'classroom', attributes: ['id', 'name'] },
      { association: 'student', attributes: ['id', 'username'] }
    ]
  });
  if (!grade) return { error: true, status: 404, message: 'Điểm số không tồn tại' };
  return { error: false, status: 200, message: 'Thành công', data: grade };
};

const createGrade = async (data) => {
  const { class_id, student_id, midterm_score, final_score } = data;
  if (!class_id || !student_id) return { error: true, status: 400, message: 'class_id và student_id là bắt buộc' };

  if (!(await Classroom.findByPk(class_id))) return { error: true, status: 404, message: 'Lớp học không tồn tại' };
  if (!(await User.findByPk(student_id))) return { error: true, status: 404, message: 'Học viên không tồn tại' };

  const existing = await Grade.findOne({ where: { class_id, student_id } });
  if (existing) return { error: true, status: 409, message: 'Điểm số cho học viên này đã tồn tại' };

  let total_score = null;
  if (midterm_score !== undefined && final_score !== undefined) total_score = (midterm_score + final_score) / 2;

  const grade = await Grade.create({
    class_id, student_id, midterm_score: midterm_score || null, final_score: final_score || null, total_score
  });
  return { error: false, status: 201, message: 'Tạo điểm số thành công', data: grade };
};

const updateGrade = async (id, data) => {
  const grade = await Grade.findByPk(id);
  if (!grade) return { error: true, status: 404, message: 'Điểm số không tồn tại' };

  if (grade.is_locked && (data.midterm_score !== undefined || data.final_score !== undefined)) {
    return { error: true, status: 403, message: 'Không thể cập nhật điểm số khi đã bị khóa' };
  }

  const newMidterm = data.midterm_score !== undefined ? data.midterm_score : grade.midterm_score;
  const newFinal = data.final_score !== undefined ? data.final_score : grade.final_score;
  let total_score = grade.total_score;
  if (newMidterm !== null && newFinal !== null) total_score = (newMidterm + newFinal) / 2;

  await grade.update({
    midterm_score: newMidterm, final_score: newFinal, total_score,
    is_locked: data.is_locked !== undefined ? data.is_locked : grade.is_locked
  });
  return { error: false, status: 200, message: 'Cập nhật điểm số thành công', data: grade };
};

const deleteGrade = async (id) => {
  const grade = await Grade.findByPk(id);
  if (!grade) return { error: true, status: 404, message: 'Điểm số không tồn tại' };
  await grade.destroy();
  return { error: false, status: 200, message: 'Xóa điểm số thành công' };
};

module.exports = { getAllGrades, getGradeById, createGrade, updateGrade, deleteGrade };