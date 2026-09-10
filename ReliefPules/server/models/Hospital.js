const mongoose = require('mongoose');

const hospitalSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    address: {
      type: String,
      required: true,
    },
    district: {
      type: String,
      default: 'Visakhapatnam',
    },
    location: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
    },
    totalBeds: {
      type: Number,
      default: 250,
    },
    availableBeds: {
      type: Number,
      default: 45,
    },
    icuBeds: {
      type: Number,
      default: 12,
    },
    ambulances: {
      type: Number,
      default: 6,
    },
    doctorsCount: {
      type: Number,
      default: 18,
    },
    nursesCount: {
      type: Number,
      default: 34,
    },
    bloodUnits: {
      type: Number,
      default: 80,
    },
    essentialMedicineStatus: {
      type: String,
      enum: ['Available', 'Limited', 'Critical'],
      default: 'Available',
    },
    status: {
      type: String,
      enum: ['Available', 'Limited', 'Critical'],
      default: 'Available',
    },
    contactPhone: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Hospital', hospitalSchema);
