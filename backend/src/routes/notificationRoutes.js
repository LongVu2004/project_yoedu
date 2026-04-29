const express = require('express');
const {
  getAllNotifications,
  getNotificationById,
  getUserNotifications,
  createNotification,
  updateNotification,
  deleteNotification,
  markAsRead
} = require('../controllers/NotificationController');
const { authenticateToken, authorizeRole } = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/', getAllNotifications);
router.get('/user/notifications', authenticateToken, getUserNotifications); // Đã chuyển lên trên
router.get('/:id', getNotificationById);
router.post('/', authenticateToken, authorizeRole('ADMIN'), createNotification);
router.put('/:id', authenticateToken, authorizeRole('ADMIN'), updateNotification);
router.delete('/:id', authenticateToken, authorizeRole('ADMIN'), deleteNotification);
router.patch('/:notificationId/mark-as-read', authenticateToken, markAsRead);

module.exports = router;