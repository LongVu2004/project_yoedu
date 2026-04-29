const express = require('express');
const {
  getAllEnrollments,
  getEnrollmentById,
  createEnrollment,
  updateEnrollment,
  deleteEnrollment
} = require('../controllers/EnrollmentController');
const { authenticateToken, authorizeRole } = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/', authenticateToken, getAllEnrollments);
router.get('/:id', authenticateToken, getEnrollmentById);
router.post('/', authenticateToken, authorizeRole('STUDENT', 'ADMIN'), createEnrollment);
router.put('/:id', authenticateToken, authorizeRole('ADMIN'), updateEnrollment);
router.delete('/:id', authenticateToken, authorizeRole('ADMIN'), deleteEnrollment);

module.exports = router;