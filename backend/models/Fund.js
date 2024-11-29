const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Fund = sequelize.define('Fund', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  fecha: { type: DataTypes.DATE, allowNull: false },
  descripcion: { type: DataTypes.TEXT, allowNull: false },
  monto: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
}, {
  tableName: 'fondos',
  timestamps: false,
});

module.exports = Fund;