const { Enrollment, User, Course, Classroom } = require('../models');

class EnrollmentController {
  /**
   * Lấy tất cả ghi danh
   */
  static async getAllEnrollments(req, res) {
    try {
      const { student_id, course_id, status, limit = 10, offset = 0 } = req.query;

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
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [['created_at', 'DESC']]
      });

      return res.status(200).json({
        success: true,
        data: enrollments,
        pagination: {
          total: enrollments.count,
          limit: parseInt(limit),
          offset: parseInt(offset)
        }
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Lỗi khi lấy danh sách ghi danh',
        error: error.message
      });
    }
  }

  /**
   * Lấy thông tin ghi danh theo ID
   */
  static async getEnrollmentById(req, res) {
    try {
      const { id } = req.params;

      const enrollment = await Enrollment.findByPk(id, {
        include: [
          { association: 'student', attributes: ['id', 'username'] },
          { association: 'course', attributes: ['id', 'name'] },
          { association: 'classroom', attributes: ['id', 'name'] }
        ]
      });

      if (!enrollment) {
        return res.status(404).json({
          success: false,
          message: 'Ghi danh không tồn tại'
        });
      }

      return res.status(200).json({
        success: true,
        data: enrollment
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Lỗi khi lấy thông tin ghi danh',
        error: error.message
      });
    }
  }

  /**
   * Tạo ghi danh mới
   */
  static async createEnrollment(req, res) {
    try {
      const { student_id, course_id, class_id } = req.body;

      if (!student_id || !course_id) {
        return res.status(400).json({
          success: false,
          message: 'student_id và course_id là bắt buộc'
        });
      }

      // Kiểm tra student, course tồn tại
      const student = await User.findByPk(student_id);
      if (!student) {
        return res.status(404).json({
          success: false,
          message: 'Học viên không tồn tại'
        });
      }

      const course = await Course.findByPk(course_id);
      if (!course) {
        return res.status(404).json({
          success: false,
          message: 'Khóa học không tồn tại'
        });
      }

      if (class_id) {
        const classroom = await Classroom.findByPk(class_id);
        if (!classroom) {
          return res.status(404).json({
            success: false,
            message: 'Lớp học không tồn tại'
          });
        }
      }

      // Kiểm tra ghi danh đã tồn tại
      const existingEnrollment = await Enrollment.findOne({
        where: { student_id, course_id }
      });

      if (existingEnrollment) {
        return res.status(409).json({
          success: false,
          message: 'Học viên đã ghi danh khóa học này rồi'
        });
      }

      const enrollment = await Enrollment.create({
        student_id,
        course_id,
        class_id: class_id || null,
        status: 'PENDING'
      });

      return res.status(201).json({
        success: true,
        message: 'Tạo ghi danh thành công',
        data: enrollment
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Lỗi khi tạo ghi danh',
        error: error.message
      });
    }
  }

  /**
   * Cập nhật ghi danh
   */
  static async updateEnrollment(req, res) {
    try {
      const { id } = req.params;
      const { class_id, status } = req.body;

      const enrollment = await Enrollment.findByPk(id);
      if (!enrollment) {
        return res.status(404).json({
          success: false,
          message: 'Ghi danh không tồn tại'
        });
      }

      if (class_id) {
        const classroom = await Classroom.findByPk(class_id);
        if (!classroom) {
          return res.status(404).json({
            success: false,
            message: 'Lớp học không tồn tại'
          });
        }
      }

      await enrollment.update({
        class_id: class_id !== undefined ? class_id : enrollment.class_id,
        status: status || enrollment.status
      });

      return res.status(200).json({
        success: true,
        message: 'Cập nhật ghi danh thành công',
        data: enrollment
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Lỗi khi cập nhật ghi danh',
        error: error.message
      });
    }
  }

  /**
   * Xóa ghi danh
   */
  static async deleteEnrollment(req, res) {
    try {
      const { id } = req.params;

      const enrollment = await Enrollment.findByPk(id);
      if (!enrollment) {
        return res.status(404).json({
          success: false,
          message: 'Ghi danh không tồn tại'
        });
      }

      await enrollment.destroy();

      return res.status(200).json({
        success: true,
        message: 'Xóa ghi danh thành công'
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Lỗi khi xóa ghi danh',
        error: error.message
      });
    }
  }
}

module.exports = EnrollmentController;
