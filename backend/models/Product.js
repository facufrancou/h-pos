const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Product = sequelize.define('Product', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  nombre: { type: DataTypes.STRING, allowNull: false },
  descripcion: { type: DataTypes.TEXT },
  precio: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  precio_alternativo: { type: DataTypes.DECIMAL(10, 2) },
  puntos_suma: { type: DataTypes.INTEGER, defaultValue: 0 },
  cantidad_stock: { type: DataTypes.INTEGER, allowNull: false },
  creado_en: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
}, {
  tableName: 'productos',
  timestamps: false,
});

module.exports = Product;
