const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const PaymentMethod = require('./PaymentMethod');
const Shift = require('./Shift'); // Importa el modelo de Turnos

const Sale = sequelize.define('Sale', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  cliente_id: { type: DataTypes.INTEGER, allowNull: true },
  metodo_pago_id: { type: DataTypes.INTEGER, allowNull: false },
  turno_id: { // Campo para asociar la venta al turno activo
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'turnos', // Nombre de la tabla relacionada
      key: 'id', // Clave primaria en turnos
    },
  },
  total: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  puntos_ganados: { type: DataTypes.INTEGER, defaultValue: 0 },
  fecha: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
}, {
  tableName: 'ventas',
  timestamps: false,
});

// Asociaciones
Sale.belongsTo(PaymentMethod, { foreignKey: 'metodo_pago_id', as: 'metodoPago' });
Sale.belongsTo(Shift, { foreignKey: 'turno_id', as: 'turno' }); // Relación con Turnos

module.exports = Sale;
