const { Notification, UserNotification, User } = require('../models');

const getAllNotifications = async (query) => {
  const { limit = 10, offset = 0 } = query;
  const notifications = await Notification.findAndCountAll({
    include: { association: 'creator', attributes: ['id', 'username'] },
    limit: parseInt(limit), offset: parseInt(offset), order: [['created_at', 'DESC']]
  });

  return {
    error: false, status: 200, message: 'Thành công', data: notifications.rows,
    pagination: { total: notifications.count, limit: parseInt(limit), offset: parseInt(offset) }
  };
};

const getNotificationById = async (id) => {
  const notification = await Notification.findByPk(id, {
    include: { association: 'creator', attributes: ['id', 'username'] }
  });
  if (!notification) return { error: true, status: 404, message: 'Thông báo không tồn tại' };
  return { error: false, status: 200, message: 'Thành công', data: notification };
};

const createNotification = async (data, creator_id) => {
  const { title, content, user_ids } = data;
  if (!title || !content) return { error: true, status: 400, message: 'title và content là bắt buộc' };

  const notification = await Notification.create({ title, content, created_by: creator_id });

  if (user_ids && Array.isArray(user_ids) && user_ids.length > 0) {
    const userNotifications = user_ids.map(user_id => ({ user_id, notification_id: notification.id }));
    await UserNotification.bulkCreate(userNotifications);
  }

  return { error: false, status: 201, message: 'Tạo thông báo thành công', data: notification };
};

const updateNotification = async (id, data) => {
  const notification = await Notification.findByPk(id);
  if (!notification) return { error: true, status: 404, message: 'Thông báo không tồn tại' };
  
  await notification.update({ title: data.title || notification.title, content: data.content || notification.content });
  return { error: false, status: 200, message: 'Cập nhật thành công', data: notification };
};

const deleteNotification = async (id) => {
  const notification = await Notification.findByPk(id);
  if (!notification) return { error: true, status: 404, message: 'Thông báo không tồn tại' };
  
  await notification.destroy();
  return { error: false, status: 200, message: 'Xóa thông báo thành công' };
};

const getUserNotifications = async (userId, query) => {
  if (!userId) return { error: true, status: 401, message: 'Không được xác thực' };
  const { limit = 10, offset = 0 } = query;

  const userNotifications = await UserNotification.findAndCountAll({
    where: { user_id: userId },
    include: { association: 'notification', attributes: ['id', 'title', 'content', 'created_at'] },
    limit: parseInt(limit), offset: parseInt(offset), order: [['id', 'DESC']]
  });

  return {
    error: false, status: 200, message: 'Thành công', data: userNotifications.rows,
    pagination: { total: userNotifications.count, limit: parseInt(limit), offset: parseInt(offset) }
  };
};

const markAsRead = async (userId, notificationId) => {
  if (!userId) return { error: true, status: 401, message: 'Không được xác thực' };

  const userNotification = await UserNotification.findOne({ where: { user_id: userId, notification_id: notificationId } });
  if (!userNotification) return { error: true, status: 404, message: 'Thông báo không tồn tại' };

  await userNotification.update({ is_read: true, read_at: new Date() });
  return { error: false, status: 200, message: 'Đánh dấu thông báo thành công', data: userNotification };
};

module.exports = { getAllNotifications, getNotificationById, createNotification, updateNotification, deleteNotification, getUserNotifications, markAsRead };