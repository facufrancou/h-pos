const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

class Shift extends Model {}

Shift.init({
    usuario: { type: DataTypes.STRING, allowNull: false },
    fondo_inicial: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    fondo_final: { type: DataTypes.DECIMAL(10, 2) },
    estado: { type: DataTypes.ENUM('abierto', 'cerrado'), defaultValue: 'abierto' },
    inicio: { type: DataTypes.DATE, allowNull: false },
    cierre: { type: DataTypes.DATE }
}, {
    sequelize,
    modelName: 'Shift',
    tableName: 'turnos'
});

module.exports = Shift;
