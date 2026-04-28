const { User, UserProfile, Role } = require('../models');

class UserController {
  /**
   * Lấy tất cả users
   */
  static async getAllUsers(req, res) {
    try {
      const { role, status, limit = 10, offset = 0 } = req.query;

      let whereClause = {};
      if (role) whereClause.role_id = role;
      if (status) whereClause.status = status;

      const users = await User.findAndCountAll({
        where: whereClause,
        include: [
          { association: 'role', attributes: ['id', 'name'] },
          { association: 'profile', attributes: ['full_name', 'email', 'phone', 'avatar_url'] }
        ],
        limit: parseInt(limit),
        offset: parseInt(offset),
        attributes: { exclude: ['password_hash'] },
        order: [['created_at', 'DESC']]
      });

      return res.status(200).json({
        success: true,
        data: users,
        pagination: {
          total: users.count,
          limit: parseInt(limit),
          offset: parseInt(offset)
        }
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Lỗi khi lấy danh sách users',
        error: error.message
      });
    }
  }

  /**
   * Lấy thông tin user theo ID
   */
  static async getUserById(req, res) {
    try {
      const { id } = req.params;

      const user = await User.findByPk(id, {
        include: [
          { association: 'role', attributes: ['id', 'name'] },
          { association: 'profile' }
        ],
        attributes: { exclude: ['password_hash'] }
      });

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User không tồn tại'
        });
      }

      return res.status(200).json({
        success: true,
        data: user
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Lỗi khi lấy thông tin user',
        error: error.message
      });
    }
  }

  /**
   * Cập nhật thông tin user
   */
  static async updateUser(req, res) {
    try {
      const { id } = req.params;
      const { full_name, email, phone, avatar_url, address, status } = req.body;

      const user = await User.findByPk(id);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User không tồn tại'
        });
      }

      // Update user
      if (status) {
        await user.update({ status });
      }

      // Update profile
      await UserProfile.update(
        {
          full_name: full_name || undefined,
          email: email || undefined,
          phone: phone || undefined,
          avatar_url: avatar_url || undefined,
          address: address || undefined
        },
        { where: { user_id: id } }
      );

      const updatedUser = await User.findByPk(id, {
        include: [
          { association: 'role', attributes: ['id', 'name'] },
          { association: 'profile' }
        ],
        attributes: { exclude: ['password_hash'] }
      });

      return res.status(200).json({
        success: true,
        message: 'Cập nhật user thành công',
        data: updatedUser
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Lỗi khi cập nhật user',
        error: error.message
      });
    }
  }

  /**
   * Xóa user
   */
  static async deleteUser(req, res) {
    try {
      const { id } = req.params;

      const user = await User.findByPk(id);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User không tồn tại'
        });
      }

      await user.destroy();

      return res.status(200).json({
        success: true,
        message: 'Xóa user thành công'
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Lỗi khi xóa user',
        error: error.message
      });
    }
  }

  /**
   * Lấy hồ sơ của user hiện tại (dựa vào JWT token)
   */
  static async getCurrentUserProfile(req, res) {
    try {
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Không được xác thực'
        });
      }

      const user = await User.findByPk(userId, {
        include: [
          { association: 'role', attributes: ['id', 'name'] },
          { association: 'profile' }
        ],
        attributes: { exclude: ['password_hash'] }
      });

      return res.status(200).json({
        success: true,
        data: user
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Lỗi khi lấy profile',
        error: error.message
      });
    }
  }
}

module.exports = UserController;
