const express = require('express');
const router = express.Router();
const withdrawalController = require('../controllers/withdrawalController');

router.get('/', withdrawalController.getWithdrawals);
router.post('/', withdrawalController.addWithdrawal);

module.exports = router;
