const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Course = sequelize.define('Course', {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(150),
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  tuition_fee: {
    type: DataTypes.DECIMAL(12, 2),
    defaultValue: 0.00
  },
  status: {
    type: DataTypes.ENUM('ACTIVE', 'DRAFT', 'ARCHIVED'),
    defaultValue: 'ACTIVE'
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  updated_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'courses',
  timestamps: false,
  underscored: true
});

module.exports = Course;
