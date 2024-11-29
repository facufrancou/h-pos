const express = require('express');
const { getCommands, updateCommand } = require('../controllers/commandController');

const router = express.Router();

router.get('/', getCommands); // Obtener todas las comandas
router.put('/:id', updateCommand); // Actualizar estado de una comanda

module.exports = router;
