const mongoose = require('mongoose');
const tz = require('mongoose-timezone');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    min: 3,
    max: 100,
  },
  code: {
    type: String,
    required: true,
    unique: true,
    min: 3,
    max: 50,
  },
  rate: {
    type: Number,
    required: true,
    min: 1,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

productSchema.plugin(tz);
module.exports = mongoose.model('Product', productSchema);
