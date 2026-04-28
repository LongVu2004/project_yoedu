const express = require('express');
const UserController = require('../controllers/UserController');
const { authenticateToken, authorizeRole } = require('../middlewares/authMiddleware');

const router = express.Router();

// Tất cả routes trong file này cần xác thực
router.use(authenticateToken);

// Routes cho User
router.get('/profile', UserController.getCurrentUserProfile);
router.get('/', UserController.getAllUsers);
router.get('/:id', UserController.getUserById);
router.put('/:id', UserController.updateUser);
router.delete('/:id', authorizeRole('ADMIN'), UserController.deleteUser);

module.exports = router;
