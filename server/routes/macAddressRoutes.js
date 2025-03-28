const express = require('express');
const router = express.Router();
const macAddressController = require('../controllers/macAddressController');

router.post('/check-mac', macAddressController.checkMACAddress);
router.post('/startTracking', macAddressController.startTracking);
router.post('/stopTracking', macAddressController.stopTracking);
router.post('/getTracking', macAddressController.getTracking);
router.post('/deleteLogs', macAddressController.deleteLogs);
router.post(
  '/display-browser-history',
  macAddressController.displayBrowserHistory
);
router.post('/deleteBrowserHistory', macAddressController.deleteBrowserHistory);
router.post(
  '/display-network-details',
  macAddressController.displayNetworkDetails
);
router.post('/deleteNetworkDetails', macAddressController.deleteNetworkDetails);
router.post(
  '/display-network-requests',
  macAddressController.displayNetworkRequests
);
router.post(
  '/deleteNetworkRequests',
  macAddressController.deleteNetworkRequests
);
router.post(
  '/display-failure-alerts',
  macAddressController.displayFailureAlerts
);
router.post('/deleteFailureAlerts', macAddressController.deleteFailureAlerts);
router.post(
  '/display-connected-devices',
  macAddressController.displayConnectedDevices
);
router.post(
  '/deleteConnectedDevices',
  macAddressController.deleteConnectedDevices
);
router.post('/check-system-health', macAddressController.checkSystemHealth);
router.post('/deleteSystemHealth', macAddressController.deleteSystemHealth);
router.get(
  '/display-cheating-devices',
  macAddressController.displayCheatingDevices
);
router.post(
  '/deleteCheatingDevices',
  macAddressController.deleteCheatingDevices
);
router.post('/shutdown-system', macAddressController.shutdownSystem);
module.exports = router;
