const express = require('express');
const router = express.Router();
const {
  getActiveAlerts,
  createAlert,
  getDisasterStats,
} = require('../controllers/alertController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/', getActiveAlerts);
router.get('/active', getActiveAlerts);
router.get('/stats', getDisasterStats);
router.post('/', protect, authorize('admin'), createAlert);

module.exports = router;
