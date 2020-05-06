//jshint esversion:6
const mongoose = require('mongoose');
// Independent Schema
const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        min: 3,
        max: 100
    },
    code: {
        type: String,
        required: true,
        unique: true,
        min: 3,
        max: 50
    },
    rate: {
        type: String,
        required: true,
        max: 50
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
});

module.exports = mongoose.model('Product', productSchema);