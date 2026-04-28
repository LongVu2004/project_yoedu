const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Classroom = sequelize.define('Classroom', {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  course_id: {
    type: DataTypes.BIGINT,
    allowNull: false
  },
  teacher_id: {
    type: DataTypes.BIGINT,
    allowNull: false
  },
  schedule_template_id: {
    type: DataTypes.BIGINT,
    allowNull: false
  },
  room_name: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  max_students: {
    type: DataTypes.INTEGER,
    defaultValue: 20
  },
  status: {
    type: DataTypes.ENUM('OPEN', 'IN_PROGRESS', 'CLOSED'),
    defaultValue: 'OPEN'
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'classrooms',
  timestamps: false,
  underscored: true
});

module.exports = Classroom;
