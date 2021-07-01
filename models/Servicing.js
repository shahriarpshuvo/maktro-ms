const mongoose = require('mongoose');
const tz = require('mongoose-timezone');

const servicingSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  name: {
    type: String,
    required: true,
    max: 100,
  },
  address: {
    type: String,
    required: true,
    max: 255,
  },
  phone: {
    type: String,
    required: true,
    max: 11,
  },
  quantity: {
    type: Number,
    required: true,
  },
  serviceCharge: {
    type: Number,
    required: true,
    default: 0,
  },
  status: {
    type: String,
    required: true,
  },
  deliveryDate: {
    type: Date,
    default: Date.now,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

servicingSchema.plugin(tz);
module.exports = mongoose.model('Servicing', servicingSchema);
