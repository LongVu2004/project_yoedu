const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const UserProfile = sequelize.define('UserProfile', {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: {
    type: DataTypes.BIGINT,
    allowNull: false,
    unique: true
  },
  full_name: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  dob: {
    type: DataTypes.DATE,
    allowNull: true
  },
  phone: {
    type: DataTypes.STRING(20),
    allowNull: true
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: true,
    unique: true
  },
  avatar_url: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  address: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'user_profiles',
  timestamps: false,
  underscored: true
});

module.exports = UserProfile;
