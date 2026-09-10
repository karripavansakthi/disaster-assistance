const express = require('express');
const router = express.Router();
const {
  createEmergency,
  getEmergencies,
  getMyEmergencies,
  getEmergencyById,
  updateEmergencyStatus,
  getEmergencyStats,
} = require('../controllers/emergencyController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/', protect, createEmergency);
router.post('/create', protect, createEmergency);
router.get('/stats', getEmergencyStats);
router.get('/all', protect, authorize('admin', 'rescue', 'volunteer', 'coordinator'), getEmergencies);
router.get('/my', protect, getMyEmergencies);
router.get('/', protect, authorize('admin', 'rescue', 'volunteer', 'coordinator'), getEmergencies);
router.get('/:id', protect, getEmergencyById);
router.patch('/:id/status', protect, authorize('admin', 'rescue', 'volunteer', 'coordinator'), updateEmergencyStatus);

module.exports = router;
