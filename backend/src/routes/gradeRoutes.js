const express = require('express');
const GradeController = require('../controllers/GradeController');
const { authenticateToken, authorizeRole } = require('../middlewares/authMiddleware');

const router = express.Router();

// GET - Cần xác thực
router.get('/', authenticateToken, GradeController.getAllGrades);
router.get('/:id', authenticateToken, GradeController.getGradeById);

// POST - TEACHER, ADMIN được phép
router.post('/', authenticateToken, authorizeRole('TEACHER', 'ADMIN'), GradeController.createGrade);

// PUT - TEACHER, ADMIN được phép
router.put('/:id', authenticateToken, authorizeRole('TEACHER', 'ADMIN'), GradeController.updateGrade);

// DELETE - ADMIN được phép
router.delete('/:id', authenticateToken, authorizeRole('ADMIN'), GradeController.deleteGrade);

module.exports = router;
