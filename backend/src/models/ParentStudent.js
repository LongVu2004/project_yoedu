const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ParentStudent = sequelize.define('ParentStudent', {
  parent_id: {
    type: DataTypes.BIGINT,
    primaryKey: true
  },
  student_id: {
    type: DataTypes.BIGINT,
    primaryKey: true
  },
  relationship_type: {
    type: DataTypes.STRING(50),
    defaultValue: 'Parent'
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'parents_students',
  timestamps: false,
  underscored: true
});

module.exports = ParentStudent;
