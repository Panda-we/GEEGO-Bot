const mongoose = require('mongoose');

/**
 * Message Schema
 * Each message is linked to both a chat and a user.
 * The `role` helps differentiate between user, model, or system-generated messages.
 */
const messageSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user', // sender user
      required: true,
    },
    chat: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'chat', // related chat
      required: true,
    },
    content: {
      type: String,
      required: true,
    //   trim: true,
    },
    role: {
      type: String,
      enum: ['user', 'model', 'system'], // helps track who sent the message
      default: 'user',
    },
  },
  {
    timestamps: true, // createdAt & updatedAt
  }
);

// ✅ Model creation
const messageModel = mongoose.model('message', messageSchema);

module.exports = messageModel;
