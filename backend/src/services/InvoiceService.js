const { Invoice, User, Enrollment } = require('../models');

const getAllInvoices = async (query) => {
  const { student_id, status, limit = 10, offset = 0 } = query;
  let whereClause = {};
  if (student_id) whereClause.student_id = student_id;
  if (status) whereClause.status = status;

  const invoices = await Invoice.findAndCountAll({
    where: whereClause,
    include: [
      { association: 'student', attributes: ['id', 'username'] },
      { association: 'enrollment', attributes: ['id', 'course_id'] }
    ],
    limit: parseInt(limit), offset: parseInt(offset), order: [['created_at', 'DESC']]
  });

  return {
    error: false, status: 200, message: 'Thành công', data: invoices.rows,
    pagination: { total: invoices.count, limit: parseInt(limit), offset: parseInt(offset) }
  };
};

const getInvoiceById = async (id) => {
  const invoice = await Invoice.findByPk(id, {
    include: [
      { association: 'student', attributes: ['id', 'username'] },
      { association: 'enrollment', attributes: ['id', 'course_id'] }
    ]
  });
  if (!invoice) return { error: true, status: 404, message: 'Hóa đơn không tồn tại' };
  return { error: false, status: 200, message: 'Thành công', data: invoice };
};

const createInvoice = async (data) => {
  const { student_id, enrollment_id, amount, due_date } = data;
  if (!student_id || !enrollment_id || !amount || !due_date) {
    return { error: true, status: 400, message: 'student_id, enrollment_id, amount, due_date là bắt buộc' };
  }

  if (!(await User.findByPk(student_id))) return { error: true, status: 404, message: 'Học viên không tồn tại' };
  if (!(await Enrollment.findByPk(enrollment_id))) return { error: true, status: 404, message: 'Ghi danh không tồn tại' };

  const invoice = await Invoice.create({ student_id, enrollment_id, amount, due_date, status: 'UNPAID' });
  return { error: false, status: 201, message: 'Tạo hóa đơn thành công', data: invoice };
};

const updateInvoice = async (id, data) => {
  const invoice = await Invoice.findByPk(id);
  if (!invoice) return { error: true, status: 404, message: 'Hóa đơn không tồn tại' };

  await invoice.update({
    amount: data.amount || invoice.amount, due_date: data.due_date || invoice.due_date,
    status: data.status || invoice.status, paid_at: data.paid_at || invoice.paid_at
  });
  return { error: false, status: 200, message: 'Cập nhật hóa đơn thành công', data: invoice };
};

const deleteInvoice = async (id) => {
  const invoice = await Invoice.findByPk(id);
  if (!invoice) return { error: true, status: 404, message: 'Hóa đơn không tồn tại' };
  await invoice.destroy();
  return { error: false, status: 200, message: 'Xóa hóa đơn thành công' };
};

module.exports = { getAllInvoices, getInvoiceById, createInvoice, updateInvoice, deleteInvoice };