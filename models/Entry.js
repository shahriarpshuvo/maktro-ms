const mongoose = require('mongoose');
const tz = require('mongoose-timezone');

const entrySchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  type: {
    type: String,
    default: 'inventory',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

entrySchema.plugin(tz);
module.exports = mongoose.model('Entry', entrySchema);
