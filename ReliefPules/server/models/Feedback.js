const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema(
  {
    shelterName: {
      type: String,
      required: true,
    },
    survivorName: {
      type: String,
      default: 'Anonymous Survivor',
    },
    cleanlinessRating: {
      type: Number,
      min: 1,
      max: 5,
      required: true,
    },
    foodRating: {
      type: Number,
      min: 1,
      max: 5,
      required: true,
    },
    medicalRating: {
      type: Number,
      min: 1,
      max: 5,
      required: true,
    },
    staffResponseRating: {
      type: Number,
      min: 1,
      max: 5,
      required: true,
    },
    comments: {
      type: String,
      default: '',
    },
    wasResolved: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Feedback', feedbackSchema);
