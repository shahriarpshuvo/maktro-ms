const mongoose = require('mongoose');
const tz = require('mongoose-timezone');

const customerSchema = new mongoose.Schema({
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
    unique: true,
    max: 11,
  },
  amount: {
    type: Number,
    default: 0,
  },
  paid: {
    type: Number,
    default: 0,
  },
  due: {
    type: Number,
    default: 0,
  },
  returnAmount: {
    type: Number,
    default: 0,
  },
  profit: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

customerSchema.plugin(tz);
module.exports = mongoose.model('Customer', customerSchema);
