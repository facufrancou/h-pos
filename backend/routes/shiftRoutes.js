const express = require('express');
const { startShift, getActiveShift, closeShift, getShiftDetails } = require('../controllers/shiftController');

const router = express.Router();


const { getAllShifts } = require('../controllers/shiftController');
router.get('/', getAllShifts); // Obtener todos los turnos
router.post('/start', startShift); // Iniciar turno
router.get('/active', getActiveShift); // Obtener turno activo
router.post('/close', closeShift); // Cerrar turno
router.get('/details', getShiftDetails);

module.exports = router;
