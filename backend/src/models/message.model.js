const mongoose = require('mongoose');

/**
 * Message Schema
 * Each message is linked to both a chat and (optionally) a user.
 * The `role` helps differentiate between user, model, or system-generated messages.
 */
const messageSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
      required: function () {
        // Only require user if the role is "user"
        return this.role === 'user';
      },
    },
    chat: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'chat',
      required: true,
    },
    content: {
      type: String,
      required: true,
      trim: true,
    },
    role: {
      type: String,
      enum: ['user', 'model', 'system'],//help to trach wo sent msg
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
