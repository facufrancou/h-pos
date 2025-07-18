const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const sequelize = require('./config/database'); // Importa la instancia de Sequelize
const defineAssociations = require('./associations'); // Importa las asociaciones

defineAssociations(); // Define las relaciones

// Importar rutas
const productRoutes = require('./routes/productRoutes');
const clientRoutes = require('./routes/clientRoutes');
const saleRoutes = require('./routes/saleRoutes');
const shiftRoutes = require('./routes/shiftRoutes');
const fundRoutes = require('./routes/fundRoutes');
const withdrawalRoutes = require('./routes/withdrawalRoutes');
const closureRoutes = require('./routes/closureRoutes');
const commandRoutes = require('./routes/commandRoutes');


const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Rutas principales
app.use('/api/products', productRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/sales', saleRoutes);
app.use('/api/funds', fundRoutes);
app.use('/api/withdrawals', withdrawalRoutes);
app.use('/api/closures', closureRoutes);
app.use('/api/commands', commandRoutes);
app.use('/api/shifts', shiftRoutes);

// Middleware global para manejo de errores
app.use((err, req, res, next) => {
  console.error('Error no manejado:', err);
  res.status(500).json({
    error: 'Error interno del servidor',
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

 /* // Iniciar el Servidor y Conectar a la Base de Datos
 sequelize.sync({ alter: true }) // Alterará la base de datos según los modelos
  .then(() => {
    console.log('Base de datos conectada y sincronizada');
    app.listen(5001, () => console.log('Servidor corriendo en http://localhost:5000'));
  })
  .catch((error) => console.error('Error al conectar con la base de datos:', error)); */

module.exports = app;