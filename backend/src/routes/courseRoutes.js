const express = require('express');
const {
  getAllCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse
} = require('../controllers/CourseController');
const { authenticateToken, authorizeRole } = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/', getAllCourses);
router.get('/:id', getCourseById);
router.post('/', authenticateToken, authorizeRole('ADMIN'), createCourse);
router.put('/:id', authenticateToken, authorizeRole('ADMIN'), updateCourse);
router.delete('/:id', authenticateToken, authorizeRole('ADMIN'), deleteCourse);

module.exports = router;