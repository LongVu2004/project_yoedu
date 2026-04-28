const { Classroom, Course, User, ScheduleTemplate } = require('../models');

class ClassroomController {
  /**
   * Lấy tất cả lớp học
   */
  static async getAllClassrooms(req, res) {
    try {
      const { course_id, status, limit = 10, offset = 0 } = req.query;

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

      return res.status(200).json({
        success: true,
        data: classrooms,
        pagination: {
          total: classrooms.count,
          limit: parseInt(limit),
          offset: parseInt(offset)
        }
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Lỗi khi lấy danh sách lớp học',
        error: error.message
      });
    }
  }

  /**
   * Lấy thông tin lớp học theo ID
   */
  static async getClassroomById(req, res) {
    try {
      const { id } = req.params;

      const classroom = await Classroom.findByPk(id, {
        include: [
          { association: 'course', attributes: ['id', 'name'] },
          { association: 'teacher', attributes: ['id', 'username'] },
          { association: 'schedule' }
        ]
      });

      if (!classroom) {
        return res.status(404).json({
          success: false,
          message: 'Lớp học không tồn tại'
        });
      }

      return res.status(200).json({
        success: true,
        data: classroom
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Lỗi khi lấy thông tin lớp học',
        error: error.message
      });
    }
  }

  /**
   * Tạo lớp học mới
   */
  static async createClassroom(req, res) {
    try {
      const { name, course_id, teacher_id, schedule_template_id, room_name, max_students } = req.body;

      if (!name || !course_id || !teacher_id || !schedule_template_id) {
        return res.status(400).json({
          success: false,
          message: 'name, course_id, teacher_id, schedule_template_id là bắt buộc'
        });
      }

      // Kiểm tra course, teacher, schedule_template tồn tại
      const course = await Course.findByPk(course_id);
      if (!course) {
        return res.status(404).json({
          success: false,
          message: 'Khóa học không tồn tại'
        });
      }

      const teacher = await User.findByPk(teacher_id);
      if (!teacher) {
        return res.status(404).json({
          success: false,
          message: 'Giáo viên không tồn tại'
        });
      }

      const schedule = await ScheduleTemplate.findByPk(schedule_template_id);
      if (!schedule) {
        return res.status(404).json({
          success: false,
          message: 'Lịch học không tồn tại'
        });
      }

      const classroom = await Classroom.create({
        name,
        course_id,
        teacher_id,
        schedule_template_id,
        room_name,
        max_students: max_students || 20,
        status: 'OPEN'
      });

      return res.status(201).json({
        success: true,
        message: 'Tạo lớp học thành công',
        data: classroom
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Lỗi khi tạo lớp học',
        error: error.message
      });
    }
  }

  /**
   * Cập nhật lớp học
   */
  static async updateClassroom(req, res) {
    try {
      const { id } = req.params;
      const { name, room_name, max_students, status } = req.body;

      const classroom = await Classroom.findByPk(id);
      if (!classroom) {
        return res.status(404).json({
          success: false,
          message: 'Lớp học không tồn tại'
        });
      }

      await classroom.update({
        name: name || classroom.name,
        room_name: room_name || classroom.room_name,
        max_students: max_students || classroom.max_students,
        status: status || classroom.status
      });

      return res.status(200).json({
        success: true,
        message: 'Cập nhật lớp học thành công',
        data: classroom
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Lỗi khi cập nhật lớp học',
        error: error.message
      });
    }
  }

  /**
   * Xóa lớp học
   */
  static async deleteClassroom(req, res) {
    try {
      const { id } = req.params;

      const classroom = await Classroom.findByPk(id);
      if (!classroom) {
        return res.status(404).json({
          success: false,
          message: 'Lớp học không tồn tại'
        });
      }

      await classroom.destroy();

      return res.status(200).json({
        success: true,
        message: 'Xóa lớp học thành công'
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Lỗi khi xóa lớp học',
        error: error.message
      });
    }
  }
}

module.exports = ClassroomController;
