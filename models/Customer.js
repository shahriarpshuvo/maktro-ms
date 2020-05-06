//jshint esversion:6
const mongoose = require('mongoose');
// Independent Schema
// Will be Updated based on Sales and Returns
const customerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        max: 100
    },
    address: {
        type: String,
        required: true,
        max: 255
    },
    phone: {
        type: String,
        required: true,
        unique: true,
        max: 11
    },
    amount: {
        // Will be updated on sales.amount && returns.amount
        type: Number,
        required: true,
        default: 0,
        max: 50
    },
    paid: {
        // Will be updated on sales.amount && returns.amount
        type: Number,
        required: true,
        default: 0,
        max: 50
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Customer', customerSchema);