const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User, Role, UserProfile } = require('../models');

const register = async ({ username, password, full_name, email, phone, role_name }) => {
  if (!username || !password || !full_name) {
    return { error: true, status: 400, message: 'Username, password, và full_name là bắt buộc' };
  }

  const existingUser = await User.findOne({ where: { username } });
  if (existingUser) {
    return { error: true, status: 409, message: 'Username đã tồn tại' };
  }

  const role = await Role.findOne({ where: { name: role_name || 'STUDENT' } });
  if (!role) {
    return { error: true, status: 400, message: 'Role không tồn tại' };
  }

  const salt = parseInt(process.env.SALT_PASSWORD || 10);
  const password_hash = await bcrypt.hash(password, salt);

  const user = await User.create({ username, password_hash, role_id: role.id, status: 'ACTIVE' });
  await UserProfile.create({ user_id: user.id, full_name, email, phone });

  return {
    error: false,
    status: 201,
    message: 'Đăng ký thành công',
    data: { id: user.id, username: user.username, role: role.name }
  };
};

const login = async ({ username, password }) => {
  if (!username || !password) {
    return { error: true, status: 400, message: 'Username và password là bắt buộc' };
  }

  const user = await User.findOne({ where: { username }, include: { association: 'role' } });
  if (!user || !(await bcrypt.compare(password, user.password_hash))) {
    return { error: true, status: 401, message: 'Username hoặc password không chính xác' };
  }

  if (user.status !== 'ACTIVE') {
    return { error: true, status: 403, message: 'Tài khoản không hoạt động' };
  }

  const accessToken = jwt.sign(
    { id: user.id, username: user.username, role: user.role.name },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: `${process.env.ACCESS_TOKEN_EXPIRES_MINUTES || 15}m` }
  );

  const refreshToken = jwt.sign(
    { id: user.id },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: `${process.env.REFRESH_TOKEN_EXPIRES_DAYS || 7}d` }
  );

  return {
    error: false,
    status: 200,
    message: 'Đăng nhập thành công',
    data: { user: { id: user.id, username: user.username, role: user.role.name }, accessToken, refreshToken }
  };
};

const refreshToken = async (token) => {
  if (!token) return { error: true, status: 400, message: 'Refresh token là bắt buộc' };

  try {
    const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
    const user = await User.findByPk(decoded.id, { include: { association: 'role' } });

    if (!user) return { error: true, status: 401, message: 'User không tồn tại' };

    const accessToken = jwt.sign(
      { id: user.id, username: user.username, role: user.role.name },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: `${process.env.ACCESS_TOKEN_EXPIRES_MINUTES || 15}m` }
    );

    return { error: false, status: 200, message: 'Refresh token thành công', data: { accessToken } };
  } catch (err) {
    return { error: true, status: 401, message: 'Refresh token không hợp lệ' };
  }
};

module.exports = { register, login, refreshToken };