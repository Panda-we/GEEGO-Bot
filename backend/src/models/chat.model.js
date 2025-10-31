const mongoose = require('mongoose');

/**
 * Chat Schema
 * Each chat belongs to a user and contains a title.
 * The `lastActivity` field updates whenever a message is sent.
 */
const chatSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user', // Reference to the user who owns this chat
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true, // remove extra spaces
    },
    lastActivity: {
      type: Date,
      default: Date.now, // auto-set when chat is created
    },
  },
  {
    timestamps: true, // adds createdAt & updatedAt fields automatically
  }
);

// ✅ Model creation
const chatModel = mongoose.model('chat', chatSchema);

module.exports = chatModel;
