const mongoose = require('mongoose');
const tz = require('mongoose-timezone');

const inventorySchema = new mongoose.Schema({
  quantity: {
    type: Number,
    required: true,
    default: 0,
  },
  sales: {
    type: Number,
    default: 0,
  },
  returns: {
    type: Number,
    default: 0,
  },
  leftOver: {
    type: Number,
    default: 0,
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
  },
});

inventorySchema.plugin(tz);
module.exports = mongoose.model('Inventory', inventorySchema);
