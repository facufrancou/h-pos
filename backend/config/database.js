const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('punto_de_venta', 'root', 'qwe567/U', {
  host: 'localhost',
  dialect: 'mysql',
  logging: false, // Desactiva logs de SQL para limpieza
});

module.exports = sequelize;
