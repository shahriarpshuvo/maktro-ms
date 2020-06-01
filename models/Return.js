const mongoose = require("mongoose");
const returnSchema = new mongoose.Schema({
    entry:{
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
        min:0
    },
    amount: {
        type: Number,
        required: true,
        min:0
    },
    returnDate: {
        type: Date,
        default: Date.now,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model("Return", returnSchema);