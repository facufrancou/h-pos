const express = require('express');
const {
  createSale,
  getSalesByDateRange,
  closeShift,
  setInitialCash,
  recordWithdrawal,
  generateInitialCashPDF,
  generateWithdrawalPDF,
  generateCloseShiftPDF,
  generateDailyReportPDF,
  getHistoricalSales,
  getHistoricalWithdrawals,
  getHistoricalClosures,
} = require('../controllers/salesController');

const router = express.Router();

// Ruta para crear una venta
router.post('/', createSale);

// Ruta para obtener ventas por rango de fechas
router.get('/date-range', getSalesByDateRange);

// Rutas para caja
router.post('/initial-cash', setInitialCash);
router.post('/withdrawals', recordWithdrawal);
router.get('/close-shift', closeShift);

// Rutas para generar PDFs
router.post('/pdf/initial-cash', generateInitialCashPDF);
router.post('/pdf/withdrawal', generateWithdrawalPDF);
router.post('/pdf/close-shift', generateCloseShiftPDF);
router.get('/pdf/daily-report', generateDailyReportPDF);

// Rutas para consultar datos históricos
router.get('/history/sales', getHistoricalSales);
router.get('/history/withdrawals', getHistoricalWithdrawals);
router.get('/history/closures', getHistoricalClosures);

module.exports = router;
