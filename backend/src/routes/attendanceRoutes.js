const express = require('express');
const {
  getAllAttendances,
  getAttendanceById,
  createAttendance,
  updateAttendance,
  deleteAttendance
} = require('../controllers/AttendanceController');
const { authenticateToken, authorizeRole } = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/', authenticateToken, getAllAttendances);
router.get('/:id', authenticateToken, getAttendanceById);
router.post('/', authenticateToken, authorizeRole('TEACHER', 'ADMIN'), createAttendance);
router.put('/:id', authenticateToken, authorizeRole('TEACHER', 'ADMIN'), updateAttendance);
router.delete('/:id', authenticateToken, authorizeRole('ADMIN'), deleteAttendance);

module.exports = router;