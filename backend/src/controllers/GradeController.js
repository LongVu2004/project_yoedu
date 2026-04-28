const { Grade, Classroom, User } = require('../models');

class GradeController {
  /**
   * Lấy tất cả điểm số
   */
  static async getAllGrades(req, res) {
    try {
      const { class_id, student_id, limit = 10, offset = 0 } = req.query;

      let whereClause = {};
      if (class_id) whereClause.class_id = class_id;
      if (student_id) whereClause.student_id = student_id;

      const grades = await Grade.findAndCountAll({
        where: whereClause,
        include: [
          { association: 'classroom', attributes: ['id', 'name'] },
          { association: 'student', attributes: ['id', 'username'] }
        ],
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [['updated_at', 'DESC']]
      });

      return res.status(200).json({
        success: true,
        data: grades,
        pagination: {
          total: grades.count,
          limit: parseInt(limit),
          offset: parseInt(offset)
        }
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Lỗi khi lấy danh sách điểm số',
        error: error.message
      });
    }
  }

  /**
   * Lấy thông tin điểm số theo ID
   */
  static async getGradeById(req, res) {
    try {
      const { id } = req.params;

      const grade = await Grade.findByPk(id, {
        include: [
          { association: 'classroom', attributes: ['id', 'name'] },
          { association: 'student', attributes: ['id', 'username'] }
        ]
      });

      if (!grade) {
        return res.status(404).json({
          success: false,
          message: 'Điểm số không tồn tại'
        });
      }

      return res.status(200).json({
        success: true,
        data: grade
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Lỗi khi lấy thông tin điểm số',
        error: error.message
      });
    }
  }

  /**
   * Tạo điểm số mới
   */
  static async createGrade(req, res) {
    try {
      const { class_id, student_id, midterm_score, final_score } = req.body;

      if (!class_id || !student_id) {
        return res.status(400).json({
          success: false,
          message: 'class_id và student_id là bắt buộc'
        });
      }

      // Kiểm tra classroom, student tồn tại
      const classroom = await Classroom.findByPk(class_id);
      if (!classroom) {
        return res.status(404).json({
          success: false,
          message: 'Lớp học không tồn tại'
        });
      }

      const student = await User.findByPk(student_id);
      if (!student) {
        return res.status(404).json({
          success: false,
          message: 'Học viên không tồn tại'
        });
      }

      // Kiểm tra điểm số đã tồn tại
      const existingGrade = await Grade.findOne({
        where: { class_id, student_id }
      });

      if (existingGrade) {
        return res.status(409).json({
          success: false,
          message: 'Điểm số cho học viên này đã tồn tại'
        });
      }

      // Tính tổng điểm
      let total_score = null;
      if (midterm_score !== undefined && final_score !== undefined) {
        total_score = (midterm_score + final_score) / 2;
      }

      const grade = await Grade.create({
        class_id,
        student_id,
        midterm_score: midterm_score || null,
        final_score: final_score || null,
        total_score
      });

      return res.status(201).json({
        success: true,
        message: 'Tạo điểm số thành công',
        data: grade
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Lỗi khi tạo điểm số',
        error: error.message
      });
    }
  }

  /**
   * Cập nhật điểm số
   */
  static async updateGrade(req, res) {
    try {
      const { id } = req.params;
      const { midterm_score, final_score, is_locked } = req.body;

      const grade = await Grade.findByPk(id);
      if (!grade) {
        return res.status(404).json({
          success: false,
          message: 'Điểm số không tồn tại'
        });
      }

      // Không cho phép cập nhật nếu điểm đã bị khóa
      if (grade.is_locked && (midterm_score !== undefined || final_score !== undefined)) {
        return res.status(403).json({
          success: false,
          message: 'Không thể cập nhật điểm số khi đã bị khóa'
        });
      }

      const newMidterm = midterm_score !== undefined ? midterm_score : grade.midterm_score;
      const newFinal = final_score !== undefined ? final_score : grade.final_score;

      let total_score = grade.total_score;
      if (newMidterm !== null && newFinal !== null) {
        total_score = (newMidterm + newFinal) / 2;
      }

      await grade.update({
        midterm_score: newMidterm,
        final_score: newFinal,
        total_score,
        is_locked: is_locked !== undefined ? is_locked : grade.is_locked
      });

      return res.status(200).json({
        success: true,
        message: 'Cập nhật điểm số thành công',
        data: grade
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Lỗi khi cập nhật điểm số',
        error: error.message
      });
    }
  }

  /**
   * Xóa điểm số
   */
  static async deleteGrade(req, res) {
    try {
      const { id } = req.params;

      const grade = await Grade.findByPk(id);
      if (!grade) {
        return res.status(404).json({
          success: false,
          message: 'Điểm số không tồn tại'
        });
      }

      await grade.destroy();

      return res.status(200).json({
        success: true,
        message: 'Xóa điểm số thành công'
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Lỗi khi xóa điểm số',
        error: error.message
      });
    }
  }
}

module.exports = GradeController;
