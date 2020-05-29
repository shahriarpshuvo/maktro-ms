const mongoose = require('mongoose');
// Will be updated on sales.quantity and returns.quantity
const inventorySchema = new mongoose.Schema({
    quantity: {
        type: Number,
        required: true,
        min: 1,
    },
    sales:{
        type: Number,
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
    },
});

module.exports = mongoose.model('Inventory', inventorySchema);
