const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      enum: ['Meals', 'Drinking Water', 'Ready-to-Eat Food', 'Baby Food', 'Blankets', 'Clothing', 'First-Aid Kits', 'Medicines', 'Hygiene Kits'],
      required: true,
    },
    itemName: {
      type: String,
      required: true,
    },
    availableQuantity: {
      type: Number,
      required: true,
      default: 0,
    },
    requiredQuantity: {
      type: Number,
      required: true,
      default: 1000,
    },
    unit: {
      type: String,
      default: 'packets',
    },
    warehouseName: {
      type: String,
      default: 'Central District Relief Depot',
    },
    warehouseLocation: {
      lat: { type: Number, default: 17.7200 },
      lng: { type: Number, default: 83.3000 },
    },
    status: {
      type: String,
      enum: ['Normal', 'Low', 'Critical'],
      default: 'Normal',
    },
    lastUpdated: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

resourceSchema.pre('save', function (next) {
  const ratio = this.availableQuantity / (this.requiredQuantity || 1);
  if (ratio < 0.25) {
    this.status = 'Critical';
  } else if (ratio < 0.60) {
    this.status = 'Low';
  } else {
    this.status = 'Normal';
  }
  next();
});

module.exports = mongoose.model('Resource', resourceSchema);
