const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ScheduleTemplate = sequelize.define('ScheduleTemplate', {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  days_of_week: {
    type: DataTypes.STRING(50),
    allowNull: false,
    comment: 'Format: 2,4,6'
  },
  start_time: {
    type: DataTypes.TIME,
    allowNull: false
  },
  end_time: {
    type: DataTypes.TIME,
    allowNull: false
  }
}, {
  tableName: 'schedule_templates',
  timestamps: false,
  underscored: true
});

module.exports = ScheduleTemplate;
