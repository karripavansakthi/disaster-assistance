const Feedback = require('../models/Feedback');
const asyncHandler = require('express-async-handler');

// @desc Get all feedback
// @route GET /api/feedback
const getFeedback = asyncHandler(async (req, res) => {
  const feedback = await Feedback.find().sort({ createdAt: -1 }).limit(50);
  res.json({ success: true, count: feedback.length, data: feedback });
});

// @desc Submit feedback
// @route POST /api/feedback
const submitFeedback = asyncHandler(async (req, res) => {
  const entry = await Feedback.create(req.body);
  res.status(201).json({ success: true, data: entry });
});

// @desc Get average ratings per shelter
// @route GET /api/feedback/averages
const getFeedbackAverages = asyncHandler(async (req, res) => {
  const averages = await Feedback.aggregate([
    {
      $group: {
        _id: '$shelterName',
        avgCleanliness: { $avg: '$cleanlinessRating' },
        avgFood: { $avg: '$foodRating' },
        avgMedical: { $avg: '$medicalRating' },
        avgStaff: { $avg: '$staffResponseRating' },
        totalFeedback: { $sum: 1 },
      },
    },
  ]);
  res.json({ success: true, data: averages });
});

module.exports = { getFeedback, submitFeedback, getFeedbackAverages };
