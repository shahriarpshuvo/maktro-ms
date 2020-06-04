const mongoose = require("mongoose");
const tz = require('mongoose-timezone');

const saleSchema = new mongoose.Schema({
    entry: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Entry',
    },
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customer',
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
    },
    quantity: {
        type: Number,
        required: true,
        min: 0
    },
    rate: {
        type: Number,
        required: true,
        min: 0
    },
    amount: {
        type: Number,
        required: true,
        min: 0
    },
    shippingCost: {
        type: Number,
        required: true,
        min: 0
    },
    discount: {
        type: Number,
        required: true,
        min: 0
    },
    paid: {
        type: Number,
        required: true,
        min: 0,
    },
    salesDate: {
        type: Date,
        default: Date.now,
    },
    comment:{
        type: String,
        default: '',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

saleSchema.plugin(tz);
module.exports = mongoose.model("Sale", saleSchema);
