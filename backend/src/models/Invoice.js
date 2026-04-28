const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Invoice = sequelize.define('Invoice', {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true
  },
  student_id: {
    type: DataTypes.BIGINT,
    allowNull: false
  },
  enrollment_id: {
    type: DataTypes.BIGINT,
    allowNull: false
  },
  amount: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false
  },
  due_date: {
    type: DataTypes.DATE,
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('UNPAID', 'PARTIAL', 'PAID', 'OVERDUE'),
    defaultValue: 'UNPAID'
  },
  paid_at: {
    type: DataTypes.DATE,
    allowNull: true
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'invoices',
  timestamps: false,
  underscored: true
});

module.exports = Invoice;
