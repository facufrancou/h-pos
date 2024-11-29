const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Closure = sequelize.define('Closure', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  tipo: { type: DataTypes.STRING(1), allowNull: false },
  fecha: { type: DataTypes.DATE, allowNull: false },
  total_ventas: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  total_retiros: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  efectivo_caja: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  total_final: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
}, {
  tableName: 'cierres',
  timestamps: false,
});

module.exports = Closure;
