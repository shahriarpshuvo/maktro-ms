const mongoose = require('mongoose');

const servicingSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
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

module.exports = mongoose.model('Servicing', servicingSchema);
