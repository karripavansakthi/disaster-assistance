const express = require('express');
const router = express.Router();
const { getFeedback, submitFeedback, getFeedbackAverages } = require('../controllers/feedbackController');

router.get('/', getFeedback);
router.get('/averages', getFeedbackAverages);
router.post('/', submitFeedback);

module.exports = router;
