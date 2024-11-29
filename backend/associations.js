const Sale = require('./models/Sale');
const Product = require('./models/Product');
const SaleProduct = require('./models/SaleProduct');
const Client = require('./models/Client');

function defineAssociations() {
  // Relación entre ventas y clientes
  Sale.belongsTo(Client, { foreignKey: 'cliente_id', as: 'cliente' });
  Client.hasMany(Sale, { foreignKey: 'cliente_id', as: 'ventas' });

  // Relación entre ventas y productos (a través de SaleProduct)
  Sale.hasMany(SaleProduct, { foreignKey: 'venta_id', as: 'productos' });
  SaleProduct.belongsTo(Sale, { foreignKey: 'venta_id', as: 'venta' });

  // Relación entre SaleProduct y Product
  SaleProduct.belongsTo(Product, { foreignKey: 'producto_id', as: 'producto' });
  Product.hasMany(SaleProduct, { foreignKey: 'producto_id', as: 'ventas' });
}

module.exports = defineAssociations;
