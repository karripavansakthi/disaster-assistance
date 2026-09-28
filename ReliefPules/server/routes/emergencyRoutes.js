const express = require('express');
const router = express.Router();
const {
  createEmergency,
  getEmergencies,
  getMyEmergencies,
  getEmergencyById,
  trackEmergency,
  acceptEmergency,
  updateEmergencyStatus,
  getEmergencyStats,
} = require('../controllers/emergencyController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Public Emergency SOS & Tracking endpoints
router.get('/track/:id', trackEmergency);
router.post('/public', createEmergency);
router.post('/:id/accept', acceptEmergency);
router.patch('/:id/status', updateEmergencyStatus);

router.post('/', protect, createEmergency);
router.post('/create', protect, createEmergency);
router.get('/stats', getEmergencyStats);
router.get('/all', getEmergencies);
router.get('/my', protect, getMyEmergencies);
router.get('/', getEmergencies);
router.get('/:id', getEmergencyById);

module.exports = router;
