const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Shift = require('./Shift'); // Importar el modelo de Turnos

const Withdrawal = sequelize.define('Withdrawal', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  turno_id: { // Relación con la tabla turnos
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'turnos',
      key: 'id',
    },
  },
  fecha: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
  descripcion: { type: DataTypes.TEXT, allowNull: false },
  monto: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
}, {
  tableName: 'retiros',
  timestamps: false,
});

// Relación con el modelo Turno
Withdrawal.belongsTo(Shift, { foreignKey: 'turno_id', as: 'turno' });

module.exports = Withdrawal;
