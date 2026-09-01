const mongoose = require('mongoose');

const forgotPasswordSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },

    otp: {
      type: String,
      required: true,
    },

    otpExpires: {
      type: Date,
      required: true,
    },

    resetToken: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
);

forgotPasswordSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const ForgotPassword = mongoose.model('ForgotPassword', forgotPasswordSchema);

module.exports = ForgotPassword;
