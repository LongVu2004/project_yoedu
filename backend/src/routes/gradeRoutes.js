const express = require('express');
const {
  getAllGrades,
  getGradeById,
  createGrade,
  updateGrade,
  deleteGrade
} = require('../controllers/GradeController');
const { authenticateToken, authorizeRole } = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/', authenticateToken, getAllGrades);
router.get('/:id', authenticateToken, getGradeById);
router.post('/', authenticateToken, authorizeRole('TEACHER', 'ADMIN'), createGrade);
router.put('/:id', authenticateToken, authorizeRole('TEACHER', 'ADMIN'), updateGrade);
router.delete('/:id', authenticateToken, authorizeRole('ADMIN'), deleteGrade);

module.exports = router;