const express = require('express');
const EnrollmentController = require('../controllers/EnrollmentController');
const { authenticateToken, authorizeRole } = require('../middlewares/authMiddleware');

const router = express.Router();

// GET - Cần xác thực
router.get('/', authenticateToken, EnrollmentController.getAllEnrollments);
router.get('/:id', authenticateToken, EnrollmentController.getEnrollmentById);

// POST - STUDENT, ADMIN được phép
router.post('/', authenticateToken, authorizeRole('STUDENT', 'ADMIN'), EnrollmentController.createEnrollment);

// PUT - ADMIN được phép
router.put('/:id', authenticateToken, authorizeRole('ADMIN'), EnrollmentController.updateEnrollment);

// DELETE - ADMIN được phép
router.delete('/:id', authenticateToken, authorizeRole('ADMIN'), EnrollmentController.deleteEnrollment);

module.exports = router;
