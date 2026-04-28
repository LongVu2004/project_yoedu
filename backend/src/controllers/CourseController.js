const { Course } = require('../models');

class CourseController {
  /**
   * Lấy tất cả khóa học
   */
  static async getAllCourses(req, res) {
    try {
      const { status, limit = 10, offset = 0 } = req.query;

      let whereClause = {};
      if (status) whereClause.status = status;

      const courses = await Course.findAndCountAll({
        where: whereClause,
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [['created_at', 'DESC']]
      });

      return res.status(200).json({
        success: true,
        data: courses,
        pagination: {
          total: courses.count,
          limit: parseInt(limit),
          offset: parseInt(offset)
        }
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Lỗi khi lấy danh sách khóa học',
        error: error.message
      });
    }
  }

  /**
   * Lấy thông tin khóa học theo ID
   */
  static async getCourseById(req, res) {
    try {
      const { id } = req.params;

      const course = await Course.findByPk(id, {
        include: { association: 'classrooms' }
      });

      if (!course) {
        return res.status(404).json({
          success: false,
          message: 'Khóa học không tồn tại'
        });
      }

      return res.status(200).json({
        success: true,
        data: course
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Lỗi khi lấy thông tin khóa học',
        error: error.message
      });
    }
  }

  /**
   * Tạo khóa học mới
   */
  static async createCourse(req, res) {
    try {
      const { name, description, tuition_fee, status } = req.body;

      if (!name) {
        return res.status(400).json({
          success: false,
          message: 'Tên khóa học là bắt buộc'
        });
      }

      const course = await Course.create({
        name,
        description,
        tuition_fee: tuition_fee || 0,
        status: status || 'ACTIVE'
      });

      return res.status(201).json({
        success: true,
        message: 'Tạo khóa học thành công',
        data: course
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Lỗi khi tạo khóa học',
        error: error.message
      });
    }
  }

  /**
   * Cập nhật khóa học
   */
  static async updateCourse(req, res) {
    try {
      const { id } = req.params;
      const { name, description, tuition_fee, status } = req.body;

      const course = await Course.findByPk(id);
      if (!course) {
        return res.status(404).json({
          success: false,
          message: 'Khóa học không tồn tại'
        });
      }

      await course.update({
        name: name || course.name,
        description: description || course.description,
        tuition_fee: tuition_fee !== undefined ? tuition_fee : course.tuition_fee,
        status: status || course.status
      });

      return res.status(200).json({
        success: true,
        message: 'Cập nhật khóa học thành công',
        data: course
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Lỗi khi cập nhật khóa học',
        error: error.message
      });
    }
  }

  /**
   * Xóa khóa học
   */
  static async deleteCourse(req, res) {
    try {
      const { id } = req.params;

      const course = await Course.findByPk(id);
      if (!course) {
        return res.status(404).json({
          success: false,
          message: 'Khóa học không tồn tại'
        });
      }

      await course.destroy();

      return res.status(200).json({
        success: true,
        message: 'Xóa khóa học thành công'
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Lỗi khi xóa khóa học',
        error: error.message
      });
    }
  }
}

module.exports = CourseController;
