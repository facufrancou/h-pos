const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Sale = require('./Sale');

const Command = sequelize.define(
  'Command',
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    venta_id: { type: DataTypes.INTEGER, allowNull: false },
    estado: {
      type: DataTypes.ENUM('pendiente', 'aceptado', 'finalizado'),
      defaultValue: 'pendiente',
    },
    creado_en: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    actualizado_en: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  },
  {
    tableName: 'comandas',
    timestamps: false,
  }
);

// Asociación
Command.belongsTo(Sale, { foreignKey: 'venta_id', as: 'venta' });

module.exports = Command;
