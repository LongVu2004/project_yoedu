const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Attendance = sequelize.define('Attendance', {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true
  },
  class_id: {
    type: DataTypes.BIGINT,
    allowNull: false
  },
  student_id: {
    type: DataTypes.BIGINT,
    allowNull: false
  },
  attendance_date: {
    type: DataTypes.DATE,
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('PRESENT', 'ABSENT', 'EXCUSED'),
    allowNull: false
  },
  note: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'attendances',
  timestamps: false,
  underscored: true,
  indexes: [{
    unique: true,
    fields: ['class_id', 'student_id', 'attendance_date']
  }]
});

module.exports = Attendance;
