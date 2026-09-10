const mongoose = require('mongoose');

const rescueTeamSchema = new mongoose.Schema(
  {
    teamId: {
      type: String,
      required: true,
      unique: true,
    },
    leaderName: {
      type: String,
      required: true,
    },
    contactPhone: {
      type: String,
      required: true,
    },
    rescuersCount: {
      type: Number,
      default: 6,
    },
    specialization: {
      type: String,
      enum: ['Flood & Boat Rescue', 'Structural Collapse', 'Medical Evacuation', 'Air Drop & Supply'],
      default: 'Flood & Boat Rescue',
    },
    status: {
      type: String,
      enum: ['Available', 'Assigned', 'En Route', 'On Scene', 'Completed'],
      default: 'Available',
    },
    currentAssignment: {
      type: String,
      default: 'Standby at Sector 4 Staging Point',
    },
    assignedSosId: {
      type: String,
      default: '',
    },
    currentLocation: {
      name: { type: String, default: 'Marine Base Camp' },
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
    },
    etaMinutes: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('RescueTeam', rescueTeamSchema);
