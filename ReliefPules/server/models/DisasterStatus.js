const mongoose = require('mongoose');

const disasterStatusSchema = new mongoose.Schema(
  {
    disasterName: {
      type: String,
      default: 'Cyclone Michaung Impact & Storm Surge',
    },
    riskLevel: {
      type: String,
      enum: ['Critical', 'High Risk', 'Moderate', 'Watch'],
      default: 'High Risk',
    },
    affectedDistricts: [
      {
        type: String,
      },
    ],
    rainfallMm: {
      type: Number,
      default: 142,
    },
    windSpeedKmh: {
      type: Number,
      default: 86,
    },
    floodRisk: {
      type: String,
      default: 'High',
    },
    evacuatedCount: {
      type: Number,
      default: 12480,
    },
    activeSosCount: {
      type: Number,
      default: 38,
    },
    sheltersOpenCount: {
      type: Number,
      default: 17,
    },
    bedsAvailableCount: {
      type: Number,
      default: 4280,
    },
    ambulancesAvailableCount: {
      type: Number,
      default: 26,
    },
    lastUpdated: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('DisasterStatus', disasterStatusSchema);
