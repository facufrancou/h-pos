const express = require('express');
const { createSale, getSales } = require('../controllers/saleController');

const router = express.Router();

router.post('/', createSale); // Crear venta
router.get('/', getSales); // Obtener todas las ventas

module.exports = router;
