const { Invoice, User, Enrollment } = require('../models');

class InvoiceController {
  /**
   * Lấy tất cả hóa đơn
   */
  static async getAllInvoices(req, res) {
    try {
      const { student_id, status, limit = 10, offset = 0 } = req.query;

      let whereClause = {};
      if (student_id) whereClause.student_id = student_id;
      if (status) whereClause.status = status;

      const invoices = await Invoice.findAndCountAll({
        where: whereClause,
        include: [
          { association: 'student', attributes: ['id', 'username'] },
          { association: 'enrollment', attributes: ['id', 'course_id'] }
        ],
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [['created_at', 'DESC']]
      });

      return res.status(200).json({
        success: true,
        data: invoices,
        pagination: {
          total: invoices.count,
          limit: parseInt(limit),
          offset: parseInt(offset)
        }
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Lỗi khi lấy danh sách hóa đơn',
        error: error.message
      });
    }
  }

  /**
   * Lấy thông tin hóa đơn theo ID
   */
  static async getInvoiceById(req, res) {
    try {
      const { id } = req.params;

      const invoice = await Invoice.findByPk(id, {
        include: [
          { association: 'student', attributes: ['id', 'username'] },
          { association: 'enrollment', attributes: ['id', 'course_id'] }
        ]
      });

      if (!invoice) {
        return res.status(404).json({
          success: false,
          message: 'Hóa đơn không tồn tại'
        });
      }

      return res.status(200).json({
        success: true,
        data: invoice
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Lỗi khi lấy thông tin hóa đơn',
        error: error.message
      });
    }
  }

  /**
   * Tạo hóa đơn mới
   */
  static async createInvoice(req, res) {
    try {
      const { student_id, enrollment_id, amount, due_date } = req.body;

      if (!student_id || !enrollment_id || !amount || !due_date) {
        return res.status(400).json({
          success: false,
          message: 'student_id, enrollment_id, amount, due_date là bắt buộc'
        });
      }

      // Kiểm tra student, enrollment tồn tại
      const student = await User.findByPk(student_id);
      if (!student) {
        return res.status(404).json({
          success: false,
          message: 'Học viên không tồn tại'
        });
      }

      const enrollment = await Enrollment.findByPk(enrollment_id);
      if (!enrollment) {
        return res.status(404).json({
          success: false,
          message: 'Ghi danh không tồn tại'
        });
      }

      const invoice = await Invoice.create({
        student_id,
        enrollment_id,
        amount,
        due_date,
        status: 'UNPAID'
      });

      return res.status(201).json({
        success: true,
        message: 'Tạo hóa đơn thành công',
        data: invoice
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Lỗi khi tạo hóa đơn',
        error: error.message
      });
    }
  }

  /**
   * Cập nhật hóa đơn
   */
  static async updateInvoice(req, res) {
    try {
      const { id } = req.params;
      const { amount, due_date, status, paid_at } = req.body;

      const invoice = await Invoice.findByPk(id);
      if (!invoice) {
        return res.status(404).json({
          success: false,
          message: 'Hóa đơn không tồn tại'
        });
      }

      await invoice.update({
        amount: amount || invoice.amount,
        due_date: due_date || invoice.due_date,
        status: status || invoice.status,
        paid_at: paid_at || invoice.paid_at
      });

      return res.status(200).json({
        success: true,
        message: 'Cập nhật hóa đơn thành công',
        data: invoice
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Lỗi khi cập nhật hóa đơn',
        error: error.message
      });
    }
  }

  /**
   * Xóa hóa đơn
   */
  static async deleteInvoice(req, res) {
    try {
      const { id } = req.params;

      const invoice = await Invoice.findByPk(id);
      if (!invoice) {
        return res.status(404).json({
          success: false,
          message: 'Hóa đơn không tồn tại'
        });
      }

      await invoice.destroy();

      return res.status(200).json({
        success: true,
        message: 'Xóa hóa đơn thành công'
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Lỗi khi xóa hóa đơn',
        error: error.message
      });
    }
  }
}

module.exports = InvoiceController;
