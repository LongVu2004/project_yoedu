const express = require('express');
const AttendanceController = require('../controllers/AttendanceController');
const { authenticateToken, authorizeRole } = require('../middlewares/authMiddleware');

const router = express.Router();

// GET - Cần xác thực
router.get('/', authenticateToken, AttendanceController.getAllAttendances);
router.get('/:id', authenticateToken, AttendanceController.getAttendanceById);

// POST - TEACHER, ADMIN được phép
router.post('/', authenticateToken, authorizeRole('TEACHER', 'ADMIN'), AttendanceController.createAttendance);

// PUT - TEACHER, ADMIN được phép
router.put('/:id', authenticateToken, authorizeRole('TEACHER', 'ADMIN'), AttendanceController.updateAttendance);

// DELETE - ADMIN được phép
router.delete('/:id', authenticateToken, authorizeRole('ADMIN'), AttendanceController.deleteAttendance);

module.exports = router;
