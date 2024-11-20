const express = require("express");
const {
  createSale,
  getSalesByDateRange,
} = require("../controllers/salesController");
const {
  setInitialCash,
  recordWithdrawal,
  closeShift,
  generateInitialCashPDF,
  generateWithdrawalPDF,
  generateCloseShiftPDF,
  generateDailyReportPDF,
  getClosures,
} = require("../controllers/salesController");
const router = express.Router();

// Ruta para crear una venta
router.post("/", createSale);

// Ruta para obtener ventas por rango de fechas
router.get("/date-range", getSalesByDateRange);

router.post("/initial-cash", setInitialCash);
router.post("/withdrawals", recordWithdrawal);
router.get("/close-shift", closeShift);
router.post("/pdf/initial-cash", generateInitialCashPDF);
router.post("/pdf/withdrawal", generateWithdrawalPDF);
router.post("/pdf/close-shift", generateCloseShiftPDF);

router.get("/pdf/daily-report", generateDailyReportPDF);
router.get("/closures", getClosures); // Nueva ruta para consultar cierres

module.exports = router;
