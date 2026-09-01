const { Schema, model, models } = require('mongoose');

const tempStoreSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      trim: true,
    },

    // Verification fields
    otp: {
      type: String,
      required: true,
    },

    otpExpires: {
      type: Date,
      required: true,
    },

    verificationToken: {
      type: String,
      required: true,
      unique: true,
    },
  },
  {
    timestamps: true,
  },
);
tempStoreSchema.index({ createdAt: 1 }, { expireAfterSeconds: 60 * 60 });

const TempStore = models.TempStore || model('TempStore', tempStoreSchema);

module.exports = TempStore;
