const mongoose = require('mongoose');

const disasterAlertSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Alert title is required'],
      trim: true,
    },
    disasterType: {
      type: String,
      enum: ['cyclone', 'flood', 'earthquake', 'tsunami', 'landslide', 'wildfire', 'weather_warning'],
      required: true,
    },
    severity: {
      type: String,
      enum: ['critical', 'severe', 'warning', 'advisory'],
      default: 'warning',
    },
    affectedAreas: [
      {
        type: String,
        trim: true,
      },
    ],
    message: {
      type: String,
      required: [true, 'Alert message is required'],
      trim: true,
    },
    evacuationRequired: {
      type: Boolean,
      default: false,
    },
    emergencyHelpline: {
      type: String,
      default: '1070',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    issuedBy: {
      type: String,
      default: 'National Disaster Management Authority (NDMA)',
    },
    broadcastTime: {
      type: Date,
      default: Date.now,
    },
    expiresAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

disasterAlertSchema.index({ isActive: 1, severity: 1, broadcastTime: -1 });

module.exports = mongoose.model('DisasterAlert', disasterAlertSchema);
