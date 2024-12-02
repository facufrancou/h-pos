const express = require('express');
const { startShift, getActiveShift, closeShift, getShiftDetails } = require('../controllers/shiftController');

const router = express.Router();

router.post('/start', startShift); // Iniciar turno
router.get('/active', getActiveShift); // Obtener turno activo
router.post('/close', closeShift); // Cerrar turno
router.get('/details', getShiftDetails);

module.exports = router;
