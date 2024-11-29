const express = require('express');
const { getClients, addClient, updateClient, deleteClient } = require('../controllers/clientController');

const router = express.Router();

router.get('/', getClients); // Obtener todos los clientes
router.post('/', addClient); // Crear cliente
router.put('/:id', updateClient); // Actualizar cliente
router.delete('/:id', deleteClient); // Eliminar cliente

module.exports = router;
