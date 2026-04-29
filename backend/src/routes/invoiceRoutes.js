const express = require('express');
const {
  getAllInvoices,
  getInvoiceById,
  createInvoice,
  updateInvoice,
  deleteInvoice
} = require('../controllers/InvoiceController');
const { authenticateToken, authorizeRole } = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/', authenticateToken, getAllInvoices);
router.get('/:id', authenticateToken, getInvoiceById);
router.post('/', authenticateToken, authorizeRole('ADMIN'), createInvoice);
router.put('/:id', authenticateToken, authorizeRole('ADMIN'), updateInvoice);
router.delete('/:id', authenticateToken, authorizeRole('ADMIN'), deleteInvoice);

module.exports = router;