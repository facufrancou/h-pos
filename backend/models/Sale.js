const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const PaymentMethod = require('./PaymentMethod');

const Sale = sequelize.define('Sale', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  cliente_id: { type: DataTypes.INTEGER, allowNull: true },
  metodo_pago_id: { type: DataTypes.INTEGER, allowNull: false },
  total: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  puntos_ganados: { type: DataTypes.INTEGER, defaultValue: 0 }, // Campo para puntos
  fecha: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
}, {
  tableName: 'ventas',
  timestamps: false,
});

// Asociaciones
Sale.belongsTo(PaymentMethod, { foreignKey: 'metodo_pago_id', as: 'metodoPago' });

module.exports = Sale;
