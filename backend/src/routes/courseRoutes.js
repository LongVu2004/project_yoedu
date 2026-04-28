const express = require('express');
const CourseController = require('../controllers/CourseController');
const { authenticateToken, authorizeRole } = require('../middlewares/authMiddleware');

const router = express.Router();

// GET - Không cần xác thực
router.get('/', CourseController.getAllCourses);
router.get('/:id', CourseController.getCourseById);

// POST, PUT, DELETE - Chỉ ADMIN được phép
router.post('/', authenticateToken, authorizeRole('ADMIN'), CourseController.createCourse);
router.put('/:id', authenticateToken, authorizeRole('ADMIN'), CourseController.updateCourse);
router.delete('/:id', authenticateToken, authorizeRole('ADMIN'), CourseController.deleteCourse);

module.exports = router;
