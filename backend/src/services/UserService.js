const { User, UserProfile } = require('../models');

const getAllUsers = async (query) => {
  const { role, status, limit = 10, offset = 0 } = query;
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

  return {
    error: false,
    status: 200,
    message: 'Lấy danh sách thành công',
    data: users.rows, // Tách rows ra làm data
    pagination: { total: users.count, limit: parseInt(limit), offset: parseInt(offset) }
  };
};

const getUserById = async (id) => {
  const user = await User.findByPk(id, {
    include: [
      { association: 'role', attributes: ['id', 'name'] },
      { association: 'profile' }
    ],
    attributes: { exclude: ['password_hash'] }
  });

  if (!user) return { error: true, status: 404, message: 'User không tồn tại' };
  return { error: false, status: 200, message: 'Thành công', data: user };
};

const updateUser = async (id, data) => {
  const user = await User.findByPk(id);
  if (!user) return { error: true, status: 404, message: 'User không tồn tại' };

  if (data.status) await user.update({ status: data.status });

  await UserProfile.update(
    {
      full_name: data.full_name || undefined,
      email: data.email || undefined,
      phone: data.phone || undefined,
      avatar_url: data.avatar_url || undefined,
      address: data.address || undefined
    },
    { where: { user_id: id } }
  );

  const updatedUser = await User.findByPk(id, {
    include: [{ association: 'role', attributes: ['id', 'name'] }, { association: 'profile' }],
    attributes: { exclude: ['password_hash'] }
  });

  return { error: false, status: 200, message: 'Cập nhật thành công', data: updatedUser };
};

const deleteUser = async (id) => {
  const user = await User.findByPk(id);
  if (!user) return { error: true, status: 404, message: 'User không tồn tại' };
  
  await user.destroy();
  return { error: false, status: 200, message: 'Xóa user thành công' };
};

module.exports = { getAllUsers, getUserById, updateUser, deleteUser };