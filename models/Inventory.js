//jshint esversion:6
const mongoose = require('mongoose');
// Depends on productSchema
// Will be updated on sales.quantity and returns.quantity
const inventorySchema = new mongoose.Schema({
    quantity: {
        type: Number,
        required: true,
        max: 50
    },
    sales:{
        type: Number,
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
    },
    //TODO: Add Entries or not
});

module.exports = mongoose.model('Inventory', inventorySchema);