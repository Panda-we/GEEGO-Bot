const mongoose = require('mongoose');

/**
 * User Schema
 * Stores account details for authentication.
 * Passwords are hashed before storage (see controller).
 */
const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true, // normalize case
      trim: true,
    },
    fullName: {
      firstName: {
        type: String,
        required: true,
        trim: true,
      },
      lastName: {
        type: String,
        required: true,
        trim: true,
      },
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// ✅ Model creation
const userModel = mongoose.model('user', userSchema);

module.exports = userModel;
