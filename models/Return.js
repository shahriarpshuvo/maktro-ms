//jshint esversion:6
const mongoose = require("mongoose");

// Depends on: customerSchema and productSchema

const returnSchema = new mongoose.Schema({
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
    // shippingCost: {
    //     type: Number,
    //     required: true,
    //     max: 10,
    // },
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
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model("Return", returnSchema);