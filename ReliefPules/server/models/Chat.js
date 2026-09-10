const mongoose = require('mongoose');

const messageItemSchema = new mongoose.Schema({
  role: {
    type: String,
    enum: ['user', 'assistant', 'system'],
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const chatSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    sessionId: {
      type: String,
      required: true,
      index: true,
    },
    title: {
      type: String,
      default: 'Disaster Assistance Chat',
      trim: true,
    },
    messages: [messageItemSchema],
  },
  {
    timestamps: true,
  }
);

// Index for fast query by user or session
chatSchema.index({ userId: 1, updatedAt: -1 });
chatSchema.index({ sessionId: 1, updatedAt: -1 });

module.exports = mongoose.model('Chat', chatSchema);
