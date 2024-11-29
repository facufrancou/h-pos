const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Product = require('./Product');
const Sale = require('./Sale');

const SaleProduct = sequelize.define('SaleProduct', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  venta_id: { type: DataTypes.INTEGER, references: { model: Sale, key: 'id' } },
  producto_id: { type: DataTypes.INTEGER, references: { model: Product, key: 'id' } },
  cantidad: { type: DataTypes.INTEGER, allowNull: false },
  precio_unitario: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  total: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
}, {
  tableName: 'productos_en_ventas',
  timestamps: false,
});

module.exports = SaleProduct;
