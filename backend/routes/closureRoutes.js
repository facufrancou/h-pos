const express = require('express');
const { getClosures, addClosure, getPartialClosure } = require('../controllers/closureController');
const router = express.Router();

router.get('/', getClosures); // Obtener todos los cierres
router.post('/', addClosure); // Agregar un nuevo cierre
router.get('/partial', getPartialClosure); // Generar cierre parcial

module.exports = router;