const mongoose = require('mongoose');
// Will be updated on sales.quantity and returns.quantity
const inventorySchema = new mongoose.Schema({
    quantity: {
        type: Number,
        required: true,
        default: 0
    },
    sales:{
        type: Number,
        default: 0,
    },
    returns:{
        type: Number,
        default: 0,
    },
    leftOver:{
        type: Number,
        default: 0, 
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
    },
});

module.exports = mongoose.model('Inventory', inventorySchema);
