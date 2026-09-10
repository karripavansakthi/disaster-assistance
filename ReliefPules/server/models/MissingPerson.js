const mongoose = require('mongoose');

const missingPersonSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    age: {
      type: Number,
      required: true,
    },
    gender: {
      type: String,
      enum: ['Male', 'Female', 'Other'],
      default: 'Male',
    },
    lastKnownLocation: {
      type: String,
      required: true,
    },
    district: {
      type: String,
      default: 'Visakhapatnam',
    },
    clothingDescription: {
      type: String,
      default: '',
    },
    identifyingMarks: {
      type: String,
      default: '',
    },
    photoUrl: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['Missing', 'Possible Match', 'Reunited'],
      default: 'Missing',
    },
    matchConfidence: {
      type: Number,
      default: 0,
    },
    lastSeenShelter: {
      type: String,
      default: '',
    },
    contactPersonName: {
      type: String,
      required: true,
    },
    contactPhone: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('MissingPerson', missingPersonSchema);
