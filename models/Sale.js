//jshint esversion:6
const mongoose = require("mongoose");

const saleSchema = new mongoose.Schema({
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customer',
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
    },
    discount: {
        type: Number,
        required: true,
        max: 5,
    },
    shippingCost: {
        type: Number,
        required: true,
        max: 10,
    },
    quantity: {
        type: Number,
        required: true,
        max: 50,
    },
    amount: {
        type: Number,
        required: true,
        max: 50,
    },
    paid: {
        type: Number,
        required: true,
        max: 50,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model("Sale", saleSchema);