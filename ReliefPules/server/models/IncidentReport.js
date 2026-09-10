const mongoose = require('mongoose');

const incidentReportSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      enum: ['Flooded Road', 'Blocked Road', 'Damaged Building', 'Missing Person', 'Medical Emergency', 'Unsafe Shelter', 'Resource Shortage', 'Other Emergency'],
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    location: {
      address: { type: String, required: true },
      district: { type: String, default: 'Visakhapatnam' },
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
    },
    severity: {
      type: String,
      enum: ['Critical', 'High', 'Moderate', 'Low'],
      default: 'Moderate',
    },
    reportedBy: {
      name: { type: String, default: 'Concerned Citizen' },
      phone: { type: String, default: '' },
    },
    status: {
      type: String,
      enum: ['Open', 'Verified', 'In Progress', 'Resolved'],
      default: 'Open',
    },
    roadStatusNote: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('IncidentReport', incidentReportSchema);
