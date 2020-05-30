const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
    purpose: {
        type: String,
        required: true,
    },
    equipments: {
        type: Number,
        required: true,
        default: 0
    },
    transports: {
        type: Number,
        required: true,
        default: 0
    },
    courierCommission: {
        type: Number,
        required: true,
        default: 0
    },
    retailHoldings: {
        type: Number,
        required: true,
        default: 0
    },
    stationeryTools: {
        type: Number,
        required: true,
        default: 0
    },
    salaryUtilities: {
        type: Number,
        required: true,
        default: 0
    },
    marketing: {
        type: Number,
        required: true,
        default: 0
    },
    others: {
        type: Number,
        required: true,
        default: 0
    },
    amount: {
        type: Number,
        required: true,
    },
    expenseDate: {
        type: Date,
        default: Date.now,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Expense', expenseSchema);