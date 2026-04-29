const express = require('express');
const {
  getCurrentUserProfile,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser
} = require('../controllers/UserController');
const { authenticateToken, authorizeRole } = require('../middlewares/authMiddleware');

const router = express.Router();

router.use(authenticateToken); // Áp dụng cho toàn bộ file này

router.get('/profile', getCurrentUserProfile);
router.get('/', getAllUsers);
router.get('/:id', getUserById);
router.put('/:id', updateUser);
router.delete('/:id', authorizeRole('ADMIN'), deleteUser);

module.exports = router;