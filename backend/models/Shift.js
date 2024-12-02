const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Shift = sequelize.define('Shift', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  usuario: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  fondo_inicial: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  fondo_final: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  activo: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  inicio: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  cierre: {
    type: DataTypes.DATE,
    allowNull: true,
  },
}, {
  tableName: 'turnos', // Especifica el nombre correcto de la tabla
});

module.exports = Shift;
