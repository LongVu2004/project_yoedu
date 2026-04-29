const express = require('express');
const {
  getAllClassrooms,
  getClassroomById,
  createClassroom,
  updateClassroom,
  deleteClassroom
} = require('../controllers/ClassroomController');
const { authenticateToken, authorizeRole } = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/', getAllClassrooms);
router.get('/:id', getClassroomById);
router.post('/', authenticateToken, authorizeRole('ADMIN'), createClassroom);
router.put('/:id', authenticateToken, authorizeRole('ADMIN', 'TEACHER'), updateClassroom);
router.delete('/:id', authenticateToken, authorizeRole('ADMIN'), deleteClassroom);

module.exports = router;