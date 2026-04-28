const { Attendance, Classroom, User } = require('../models');

class AttendanceController {
  /**
   * Lấy tất cả điểm danh
   */
  static async getAllAttendances(req, res) {
    try {
      const { class_id, student_id, status, limit = 10, offset = 0 } = req.query;

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

      return res.status(200).json({
        success: true,
        data: attendances,
        pagination: {
          total: attendances.count,
          limit: parseInt(limit),
          offset: parseInt(offset)
        }
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Lỗi khi lấy danh sách điểm danh',
        error: error.message
      });
    }
  }

  /**
   * Lấy thông tin điểm danh theo ID
   */
  static async getAttendanceById(req, res) {
    try {
      const { id } = req.params;

      const attendance = await Attendance.findByPk(id, {
        include: [
          { association: 'classroom', attributes: ['id', 'name'] },
          { association: 'student', attributes: ['id', 'username'] }
        ]
      });

      if (!attendance) {
        return res.status(404).json({
          success: false,
          message: 'Điểm danh không tồn tại'
        });
      }

      return res.status(200).json({
        success: true,
        data: attendance
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Lỗi khi lấy thông tin điểm danh',
        error: error.message
      });
    }
  }

  /**
   * Tạo điểm danh mới
   */
  static async createAttendance(req, res) {
    try {
      const { class_id, student_id, attendance_date, status, note } = req.body;

      if (!class_id || !student_id || !attendance_date || !status) {
        return res.status(400).json({
          success: false,
          message: 'class_id, student_id, attendance_date, status là bắt buộc'
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

      // Kiểm tra đã có điểm danh cho ngày này
      const existingAttendance = await Attendance.findOne({
        where: { class_id, student_id, attendance_date }
      });

      if (existingAttendance) {
        return res.status(409).json({
          success: false,
          message: 'Điểm danh cho ngày này đã tồn tại'
        });
      }

      const attendance = await Attendance.create({
        class_id,
        student_id,
        attendance_date,
        status,
        note
      });

      return res.status(201).json({
        success: true,
        message: 'Tạo điểm danh thành công',
        data: attendance
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Lỗi khi tạo điểm danh',
        error: error.message
      });
    }
  }

  /**
   * Cập nhật điểm danh
   */
  static async updateAttendance(req, res) {
    try {
      const { id } = req.params;
      const { status, note } = req.body;

      const attendance = await Attendance.findByPk(id);
      if (!attendance) {
        return res.status(404).json({
          success: false,
          message: 'Điểm danh không tồn tại'
        });
      }

      await attendance.update({
        status: status || attendance.status,
        note: note || attendance.note
      });

      return res.status(200).json({
        success: true,
        message: 'Cập nhật điểm danh thành công',
        data: attendance
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Lỗi khi cập nhật điểm danh',
        error: error.message
      });
    }
  }

  /**
   * Xóa điểm danh
   */
  static async deleteAttendance(req, res) {
    try {
      const { id } = req.params;

      const attendance = await Attendance.findByPk(id);
      if (!attendance) {
        return res.status(404).json({
          success: false,
          message: 'Điểm danh không tồn tại'
        });
      }

      await attendance.destroy();

      return res.status(200).json({
        success: true,
        message: 'Xóa điểm danh thành công'
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Lỗi khi xóa điểm danh',
        error: error.message
      });
    }
  }
}

module.exports = AttendanceController;
