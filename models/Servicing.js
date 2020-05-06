//jshint esversion:6
const mongoose = require("mongoose");
// Depends on: productSchema
const servicingSchema = new mongoose.Schema({
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
        unique: true,
        max: 11,
    },
    quantity: {
        type: Number,
        required: true,
        max: 50,
    },
    product: {
        //TODO: Foreign Key
        name: {},
        code: {},
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

module.exports = mongoose.model("Servicing", servicingSchema);