const express = require('express');
const { createSale, getSalesByDateRange } = require('../controllers/salesController');
const router = express.Router();

// Ruta para crear una venta
router.post('/', createSale);

// Ruta para obtener ventas por rango de fechas
router.get('/date-range', getSalesByDateRange);

module.exports = router;