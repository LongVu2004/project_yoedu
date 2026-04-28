const express = require('express');
const NotificationController = require('../controllers/NotificationController');
const { authenticateToken, authorizeRole } = require('../middlewares/authMiddleware');

const router = express.Router();

// GET - Không cần xác thực (lấy tất cả thông báo)
router.get('/', NotificationController.getAllNotifications);
router.get('/:id', NotificationController.getNotificationById);

// GET - Cần xác thực (lấy thông báo của user hiện tại)
router.get('/user/notifications', authenticateToken, NotificationController.getUserNotifications);

// POST - ADMIN được phép
router.post('/', authenticateToken, authorizeRole('ADMIN'), NotificationController.createNotification);

// PUT - ADMIN được phép
router.put('/:id', authenticateToken, authorizeRole('ADMIN'), NotificationController.updateNotification);

// DELETE - ADMIN được phép
router.delete('/:id', authenticateToken, authorizeRole('ADMIN'), NotificationController.deleteNotification);

// PATCH - Đánh dấu đã đọc (cần xác thực)
router.patch('/:notificationId/mark-as-read', authenticateToken, NotificationController.markAsRead);

module.exports = router;
