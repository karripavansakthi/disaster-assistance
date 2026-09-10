const express = require('express');
const router = express.Router();
const {
  getShelters,
  getNearbyShelters,
  getShelterById,
  createShelter,
  updateShelterOccupancy,
  getAiShelterRecommendations,
} = require('../controllers/shelterController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/', getShelters);
router.get('/nearby', getNearbyShelters);
router.get('/ai-recommendation', getAiShelterRecommendations);
router.get('/:id', getShelterById);
router.post('/', protect, authorize('admin', 'shelter_manager', 'volunteer'), createShelter);
router.patch('/:id/occupancy', protect, updateShelterOccupancy);

module.exports = router;
