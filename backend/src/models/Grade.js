const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Grade = sequelize.define('Grade', {
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
  midterm_score: {
    type: DataTypes.DECIMAL(4, 2),
    allowNull: true
  },
  final_score: {
    type: DataTypes.DECIMAL(4, 2),
    allowNull: true
  },
  total_score: {
    type: DataTypes.DECIMAL(4, 2),
    allowNull: true
  },
  is_locked: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  updated_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'grades',
  timestamps: false,
  underscored: true,
  indexes: [{
    unique: true,
    fields: ['class_id', 'student_id']
  }]
});

module.exports = Grade;
