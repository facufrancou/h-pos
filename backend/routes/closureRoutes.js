const express = require('express');
const router = express.Router();
const closureController = require('../controllers/closureController');

router.get('/', closureController.getClosures);
router.post('/', closureController.addClosure);

module.exports = router;
