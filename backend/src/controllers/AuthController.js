const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User, Role, UserProfile } = require('../models');

class AuthController {
  /**
   * Đăng ký tài khoản mới
   */
  static async register(req, res) {
    try {
      const { username, password, full_name, email, phone, role_name } = req.body;

      // Validation
      if (!username || !password || !full_name) {
        return res.status(400).json({
          success: false,
          message: 'Username, password, và full_name là bắt buộc'
        });
      }

      // Kiểm tra username đã tồn tại
      const existingUser = await User.findOne({ where: { username } });
      if (existingUser) {
        return res.status(409).json({
          success: false,
          message: 'Username đã tồn tại'
        });
      }

      // Lấy role_id từ tên role
      let role = await Role.findOne({ where: { name: role_name || 'STUDENT' } });
      if (!role) {
        return res.status(400).json({
          success: false,
          message: 'Role không tồn tại'
        });
      }

      // Hash password
      const salt = parseInt(process.env.SALT_PASSWORD || 10);
      const password_hash = await bcrypt.hash(password, salt);

      // Tạo user
      const user = await User.create({
        username,
        password_hash,
        role_id: role.id,
        status: 'ACTIVE'
      });

      // Tạo profile
      await UserProfile.create({
        user_id: user.id,
        full_name,
        email,
        phone
      });

      // Trả về user info (không có password)
      return res.status(201).json({
        success: true,
        message: 'Đăng ký thành công',
        data: {
          id: user.id,
          username: user.username,
          role: role.name
        }
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Lỗi khi đăng ký',
        error: error.message
      });
    }
  }

  /**
   * Đăng nhập
   */
  static async login(req, res) {
    try {
      const { username, password } = req.body;

      if (!username || !password) {
        return res.status(400).json({
          success: false,
          message: 'Username và password là bắt buộc'
        });
      }

      // Tìm user
      const user = await User.findOne({
        where: { username },
        include: { association: 'role' }
      });

      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Username hoặc password không chính xác'
        });
      }

      // Kiểm tra password
      const isPasswordValid = await bcrypt.compare(password, user.password_hash);
      if (!isPasswordValid) {
        return res.status(401).json({
          success: false,
          message: 'Username hoặc password không chính xác'
        });
      }

      // Kiểm tra status
      if (user.status !== 'ACTIVE') {
        return res.status(403).json({
          success: false,
          message: 'Tài khoản không hoạt động'
        });
      }

      // Tạo tokens
      const accessToken = jwt.sign(
        {
          id: user.id,
          username: user.username,
          role: user.role.name
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
          expiresIn: `${process.env.ACCESS_TOKEN_EXPIRES_MINUTES || 15}m`
        }
      );

      const refreshToken = jwt.sign(
        { id: user.id },
        process.env.REFRESH_TOKEN_SECRET,
        {
          expiresIn: `${process.env.REFRESH_TOKEN_EXPIRES_DAYS || 7}d`
        }
      );

      return res.status(200).json({
        success: true,
        message: 'Đăng nhập thành công',
        data: {
          user: {
            id: user.id,
            username: user.username,
            role: user.role.name
          },
          accessToken,
          refreshToken
        }
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Lỗi khi đăng nhập',
        error: error.message
      });
    }
  }

  /**
   * Refresh token
   */
  static async refreshToken(req, res) {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        return res.status(400).json({
          success: false,
          message: 'Refresh token là bắt buộc'
        });
      }

      // Verify refresh token
      const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

      // Tìm user
      const user = await User.findByPk(decoded.id, {
        include: { association: 'role' }
      });

      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'User không tồn tại'
        });
      }

      // Tạo access token mới
      const newAccessToken = jwt.sign(
        {
          id: user.id,
          username: user.username,
          role: user.role.name
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
          expiresIn: `${process.env.ACCESS_TOKEN_EXPIRES_MINUTES || 15}m`
        }
      );

      return res.status(200).json({
        success: true,
        message: 'Refresh token thành công',
        data: {
          accessToken: newAccessToken
        }
      });
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: 'Refresh token không hợp lệ',
        error: error.message
      });
    }
  }
}

module.exports = AuthController;
