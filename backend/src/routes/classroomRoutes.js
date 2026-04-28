const express = require('express');
const ClassroomController = require('../controllers/ClassroomController');
const { authenticateToken, authorizeRole } = require('../middlewares/authMiddleware');

const router = express.Router();

// GET - Không cần xác thực
router.get('/', ClassroomController.getAllClassrooms);
router.get('/:id', ClassroomController.getClassroomById);

// POST, PUT, DELETE - Chỉ ADMIN và TEACHER được phép
router.post('/', authenticateToken, authorizeRole('ADMIN'), ClassroomController.createClassroom);
router.put('/:id', authenticateToken, authorizeRole('ADMIN', 'TEACHER'), ClassroomController.updateClassroom);
router.delete('/:id', authenticateToken, authorizeRole('ADMIN'), ClassroomController.deleteClassroom);

module.exports = router;
