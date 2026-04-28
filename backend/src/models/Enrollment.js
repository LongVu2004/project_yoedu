const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Enrollment = sequelize.define('Enrollment', {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true
  },
  student_id: {
    type: DataTypes.BIGINT,
    allowNull: false
  },
  course_id: {
    type: DataTypes.BIGINT,
    allowNull: false
  },
  class_id: {
    type: DataTypes.BIGINT,
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('PENDING', 'APPROVED', 'REJECTED', 'CANCELED'),
    defaultValue: 'PENDING'
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
  tableName: 'enrollments',
  timestamps: false,
  underscored: true
});

module.exports = Enrollment;
