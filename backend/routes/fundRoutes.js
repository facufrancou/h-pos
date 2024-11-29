const express = require('express');
const router = express.Router();
const fundController = require('../controllers/fundController');

router.get('/', fundController.getFunds);
router.post('/', fundController.addFund);

module.exports = router;
