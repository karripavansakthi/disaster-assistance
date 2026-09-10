const mongoose = require('mongoose');

const timelineStageSchema = new mongoose.Schema({
  stage: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  notes: {
    type: String,
    default: '',
  },
  completed: {
    type: Boolean,
    default: true,
  },
});

const emergencyRequestSchema = new mongoose.Schema(
  {
    sosId: {
      type: String,
      unique: true,
      index: true,
    },
    victim: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    victimName: {
      type: String,
      required: [true, 'Victim name or reporting person name is required'],
      trim: true,
    },
    phone: {
      type: String,
      required: [true, 'Contact phone number is required'],
      trim: true,
    },
    alternatePhone: {
      type: String,
      trim: true,
      default: '',
    },
    disasterType: {
      type: String,
      enum: ['flood', 'cyclone', 'earthquake', 'landslide', 'fire', 'tsunami', 'other'],
      default: 'cyclone',
    },
    assistanceType: {
      type: String,
      enum: ['rescue', 'medical', 'food_water', 'shelter', 'evacuation', 'all_critical'],
      default: 'rescue',
    },
    assistanceRequired: [{
      type: String,
    }],
    severity: {
      type: String,
      enum: ['critical', 'high', 'moderate', 'low'],
      default: 'high',
    },
    priorityScore: {
      type: Number,
      min: 0,
      max: 100,
      default: 75,
    },
    triageReason: {
      type: String,
      default: 'AI-assisted triage — requires human verification.',
    },
    medicalEmergency: {
      type: Boolean,
      default: false,
    },
    location: {
      address: {
        type: String,
        required: [true, 'Location address or landmark is required'],
      },
      city: { type: String, default: 'Visakhapatnam' },
      district: { type: String, default: 'Visakhapatnam' },
      coordinates: {
        lat: { type: Number, required: true },
        lng: { type: Number, required: true },
      },
    },
    peopleCount: {
      type: Number,
      default: 1,
      min: 1,
    },
    vulnerablePeople: {
      children: { type: Number, default: 0 },
      elderly: { type: Number, default: 0 },
      injured: { type: Number, default: 0 },
      disabled: { type: Number, default: 0 },
      pregnant: { type: Number, default: 0 },
    },
    description: {
      type: String,
      required: [true, 'Please describe current danger and needs'],
      trim: true,
    },
    status: {
      type: String,
      enum: ['pending', 'assigned', 'en_route', 'on_scene', 'rescued', 'resolved', 'cancelled'],
      default: 'pending',
    },
    assignedTeam: {
      teamId: { type: String, default: '' },
      leader: { type: String, default: '' },
      contact: { type: String, default: '' },
      etaMinutes: { type: Number, default: 0 },
    },
    assignedVolunteer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    recommendedShelter: {
      name: { type: String, default: '' },
      distance: { type: String, default: '' },
      availableBeds: { type: Number, default: 0 },
    },
    routeSafety: {
      recommendedRoute: { type: String, default: '' },
      warnings: [{ type: String }],
      estimatedMinutes: { type: Number, default: 14 },
    },
    rescueTimeline: [timelineStageSchema],
  },
  {
    timestamps: true,
  }
);

// Auto-generate SOS ID if not present (e.g. REQ1024)
emergencyRequestSchema.pre('save', function (next) {
  if (!this.sosId) {
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    this.sosId = `REQ${randomNum}`;
  }
  next();
});

emergencyRequestSchema.index({ status: 1, priorityScore: -1, createdAt: -1 });
emergencyRequestSchema.index({ 'location.coordinates.lat': 1, 'location.coordinates.lng': 1 });

module.exports = mongoose.model('EmergencyRequest', emergencyRequestSchema);
