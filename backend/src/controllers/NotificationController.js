const { Notification, UserNotification, User } = require('../models');
const { Op } = require('sequelize');

class NotificationController {
  /**
   * Lấy tất cả thông báo (chưa phân phối)
   */
  static async getAllNotifications(req, res) {
    try {
      const { limit = 10, offset = 0 } = req.query;

      const notifications = await Notification.findAndCountAll({
        include: {
          association: 'creator',
          attributes: ['id', 'username']
        },
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [['created_at', 'DESC']]
      });

      return res.status(200).json({
        success: true,
        data: notifications,
        pagination: {
          total: notifications.count,
          limit: parseInt(limit),
          offset: parseInt(offset)
        }
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Lỗi khi lấy danh sách thông báo',
        error: error.message
      });
    }
  }

  /**
   * Lấy thông báo theo ID
   */
  static async getNotificationById(req, res) {
    try {
      const { id } = req.params;

      const notification = await Notification.findByPk(id, {
        include: {
          association: 'creator',
          attributes: ['id', 'username']
        }
      });

      if (!notification) {
        return res.status(404).json({
          success: false,
          message: 'Thông báo không tồn tại'
        });
      }

      return res.status(200).json({
        success: true,
        data: notification
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Lỗi khi lấy thông báo',
        error: error.message
      });
    }
  }

  /**
   * Tạo thông báo mới
   */
  static async createNotification(req, res) {
    try {
      const { title, content, user_ids } = req.body;
      const created_by = req.user?.id;

      if (!title || !content) {
        return res.status(400).json({
          success: false,
          message: 'title và content là bắt buộc'
        });
      }

      // Tạo thông báo
      const notification = await Notification.create({
        title,
        content,
        created_by
      });

      // Phân phối cho users (nếu có)
      if (user_ids && Array.isArray(user_ids) && user_ids.length > 0) {
        const userNotifications = user_ids.map(user_id => ({
          user_id,
          notification_id: notification.id
        }));
        await UserNotification.bulkCreate(userNotifications);
      }

      return res.status(201).json({
        success: true,
        message: 'Tạo thông báo thành công',
        data: notification
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Lỗi khi tạo thông báo',
        error: error.message
      });
    }
  }

  /**
   * Cập nhật thông báo
   */
  static async updateNotification(req, res) {
    try {
      const { id } = req.params;
      const { title, content } = req.body;

      const notification = await Notification.findByPk(id);
      if (!notification) {
        return res.status(404).json({
          success: false,
          message: 'Thông báo không tồn tại'
        });
      }

      await notification.update({
        title: title || notification.title,
        content: content || notification.content
      });

      return res.status(200).json({
        success: true,
        message: 'Cập nhật thông báo thành công',
        data: notification
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Lỗi khi cập nhật thông báo',
        error: error.message
      });
    }
  }

  /**
   * Xóa thông báo
   */
  static async deleteNotification(req, res) {
    try {
      const { id } = req.params;

      const notification = await Notification.findByPk(id);
      if (!notification) {
        return res.status(404).json({
          success: false,
          message: 'Thông báo không tồn tại'
        });
      }

      await notification.destroy();

      return res.status(200).json({
        success: true,
        message: 'Xóa thông báo thành công'
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Lỗi khi xóa thông báo',
        error: error.message
      });
    }
  }

  /**
   * Lấy danh sách thông báo của user hiện tại
   */
  static async getUserNotifications(req, res) {
    try {
      const userId = req.user?.id;
      const { limit = 10, offset = 0 } = req.query;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Không được xác thực'
        });
      }

      const userNotifications = await UserNotification.findAndCountAll({
        where: { user_id: userId },
        include: {
          association: 'notification',
          attributes: ['id', 'title', 'content', 'created_at']
        },
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [['id', 'DESC']]
      });

      return res.status(200).json({
        success: true,
        data: userNotifications,
        pagination: {
          total: userNotifications.count,
          limit: parseInt(limit),
          offset: parseInt(offset)
        }
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Lỗi khi lấy thông báo',
        error: error.message
      });
    }
  }

  /**
   * Đánh dấu thông báo là đã đọc
   */
  static async markAsRead(req, res) {
    try {
      const { notificationId } = req.params;
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Không được xác thực'
        });
      }

      const userNotification = await UserNotification.findOne({
        where: {
          user_id: userId,
          notification_id: notificationId
        }
      });

      if (!userNotification) {
        return res.status(404).json({
          success: false,
          message: 'Thông báo không tồn tại'
        });
      }

      await userNotification.update({
        is_read: true,
        read_at: new Date()
      });

      return res.status(200).json({
        success: true,
        message: 'Đánh dấu thông báo thành công',
        data: userNotification
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Lỗi khi đánh dấu thông báo',
        error: error.message
      });
    }
  }
}

module.exports = NotificationController;
