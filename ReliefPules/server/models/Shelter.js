const mongoose = require('mongoose');

const shelterSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Shelter name is required'],
      trim: true,
    },
    address: {
      type: String,
      required: [true, 'Shelter physical address is required'],
      trim: true,
    },
    city: {
      type: String,
      required: true,
      trim: true,
    },
    district: {
      type: String,
      default: 'Visakhapatnam',
    },
    location: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
    },
    totalCapacity: {
      type: Number,
      required: [true, 'Total capacity is required'],
      min: 1,
    },
    currentOccupancy: {
      type: Number,
      default: 0,
      min: 0,
    },
    status: {
      type: String,
      enum: ['open', 'limited', 'full', 'evacuating', 'closed'],
      default: 'open',
    },
    contactPerson: {
      type: String,
      required: true,
      trim: true,
    },
    contactPhone: {
      type: String,
      required: true,
      trim: true,
    },
    mealsAvailable: {
      type: Number,
      default: 900,
    },
    waterBottles: {
      type: Number,
      default: 1500,
    },
    medicalStaffAvailable: {
      type: Boolean,
      default: true,
    },
    ambulancesCount: {
      type: Number,
      default: 2,
    },
    routeStatus: {
      type: String,
      enum: ['Open', 'Caution', 'Blocked', 'Waterlogged'],
      default: 'Open',
    },
    roadWarnings: [
      {
        type: String,
      },
    ],
    recommendedRoute: {
      type: String,
      default: 'Route B (Hill Road Bypass)',
    },
    amenities: {
      hasFood: { type: Boolean, default: true },
      hasMedical: { type: Boolean, default: true },
      hasPowerBackup: { type: Boolean, default: true },
      hasCleanWater: { type: Boolean, default: true },
      hasBedding: { type: Boolean, default: true },
      hasWheelchairAccess: { type: Boolean, default: true },
      hasChildcare: { type: Boolean, default: true },
    },
    lastVerifiedTime: {
      type: Date,
      default: Date.now,
    },
    imageUrl: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

shelterSchema.virtual('availableBeds').get(function () {
  return Math.max(0, this.totalCapacity - this.currentOccupancy);
});

shelterSchema.set('toJSON', { virtuals: true });
shelterSchema.set('toObject', { virtuals: true });

shelterSchema.index({ status: 1 });
shelterSchema.index({ 'location.lat': 1, 'location.lng': 1 });

module.exports = mongoose.model('Shelter', shelterSchema);
