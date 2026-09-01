const { Schema, model, models } = require('mongoose');

const storeSchema = new Schema(
  {
    // Store fields
    logo: {
      url: {
        type: String,
        default: '',
      },
      public_id: {
        type: String,
        default: '',
      },
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },
    tagline: {
      type: String,
      default: '',
    },
    address: {
      type: String,
      default: '',
    },
    phone: {
      type: String,
      default: '',
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    // Authentication fields
    password: {
      type: String,
      required: true,
      trim: true,
    },

    // Invoice fields
    invoicePrefix: {
      type: String,
      default: 'INV-',
    },
    nextInvoiceNumber: {
      type: Number,
      default: 1,
    },
    defaultTax: {
      type: Number,
      default: 0,
    },
    defaultDuePeriod: {
      type: Number,
      default: 30,
    },
    currencySymbol: {
      type: String,
      default: '৳',
    },

    invoiceFooterNote: {
      type: String,
      default: 'Thank you for your shopping!',
    },
  },
  { timestamps: true },
);

const Store = models.Store || model('Store', storeSchema);

module.exports = Store;
