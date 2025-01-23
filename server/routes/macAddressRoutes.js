const express = require('express');
const router = express.Router();
const macAddressController = require('../controllers/macAddressController');

router.post('/check-mac', macAddressController.checkMACAddress);
router.post('/startTracking', macAddressController.startTracking);
router.post('/stopTracking', macAddressController.stopTracking);
router.post('/getTracking', macAddressController.getTracking);
module.exports = router;
