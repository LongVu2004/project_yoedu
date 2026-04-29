const InvoiceService = require('../services/InvoiceService');
const catchAsync = require('../utils/catchAsync');
const { sendSuccess, sendError } = require('../utils/responseHelper');

const getAllInvoices = catchAsync(async (req, res) => {
  const result = await InvoiceService.getAllInvoices(req.query);
  return sendSuccess(res, result.status, result.message, result.data, result.pagination);
});

const getInvoiceById = catchAsync(async (req, res) => {
  const result = await InvoiceService.getInvoiceById(req.params.id);
  if (result.error) return sendError(res, result.status, result.message);
  return sendSuccess(res, result.status, result.message, result.data);
});

const createInvoice = catchAsync(async (req, res) => {
  const result = await InvoiceService.createInvoice(req.body);
  if (result.error) return sendError(res, result.status, result.message);
  return sendSuccess(res, result.status, result.message, result.data);
});

const updateInvoice = catchAsync(async (req, res) => {
  const result = await InvoiceService.updateInvoice(req.params.id, req.body);
  if (result.error) return sendError(res, result.status, result.message);
  return sendSuccess(res, result.status, result.message, result.data);
});

const deleteInvoice = catchAsync(async (req, res) => {
  const result = await InvoiceService.deleteInvoice(req.params.id);
  if (result.error) return sendError(res, result.status, result.message);
  return sendSuccess(res, result.status, result.message);
});

module.exports = { getAllInvoices, getInvoiceById, createInvoice, updateInvoice, deleteInvoice };