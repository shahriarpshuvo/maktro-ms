//jshint esversion:6
const mongoose = require('mongoose');
// Depends on productSchema
// Will be updated on sales.quantity and returns.quantity
const inventorySchema = new mongoose.Schema({
    quantity: {
        // Subject to changed on: re
        type: Number,
        required: true,
        max: 50
    },
    product: {
        // TODO: Foreign Schema
        name: {},
        code: {},
        rate: {}
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
});

module.exports = mongoose.model('Inventory', inventorySchema);