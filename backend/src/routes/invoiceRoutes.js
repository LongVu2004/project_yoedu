const express = require('express');
const InvoiceController = require('../controllers/InvoiceController');
const { authenticateToken, authorizeRole } = require('../middlewares/authMiddleware');

const router = express.Router();

// GET - Cần xác thực
router.get('/', authenticateToken, InvoiceController.getAllInvoices);
router.get('/:id', authenticateToken, InvoiceController.getInvoiceById);

// POST - ADMIN được phép
router.post('/', authenticateToken, authorizeRole('ADMIN'), InvoiceController.createInvoice);

// PUT - ADMIN được phép
router.put('/:id', authenticateToken, authorizeRole('ADMIN'), InvoiceController.updateInvoice);

// DELETE - ADMIN được phép
router.delete('/:id', authenticateToken, authorizeRole('ADMIN'), InvoiceController.deleteInvoice);

module.exports = router;
