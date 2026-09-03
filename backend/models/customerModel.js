const { Schema, model, models } = require('mongoose');

const customerSchema = new Schema(
  {
    store: {
      type: Schema.Types.ObjectId,
      ref: 'Store',
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },

    phone: {
      type: String,
      required: true,
      trim: true,
    },

    address: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);

const Customer = models.Customer || model('Customer', customerSchema);

module.exports = Customer;
