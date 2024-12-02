const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Shift = require('./Shift'); // Importar el modelo de Turnos

const Fund = sequelize.define('Fund', {
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
  tableName: 'fondos',
  timestamps: false,
});

// Relación con el modelo Turno
Fund.belongsTo(Shift, { foreignKey: 'turno_id', as: 'turno' });

module.exports = Fund;
