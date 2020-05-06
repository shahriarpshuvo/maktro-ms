//jshint esversion:6
const mongoose = require("mongoose");

// Depends on: customerSchema and productSchema

const saleSchema = new mongoose.Schema({
    customer: {
        //TODO: Foreign Key
        name: {},
        phone: {},
    },
    product: {
        //TODO: Foreign Key
        name: {},
        code: {},
        rate: {},
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