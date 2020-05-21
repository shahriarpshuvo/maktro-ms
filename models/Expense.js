const mongoose = require('mongoose');
// Independent Schema
const expenseSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        max: 100,
    },
    equipments: {
        type: Number,
        required: true,
        max: 50,
    },
    transports: {
        type: Number,
        required: true,
        max: 50,
    },
    courierCommission: {
        type: Number,
        required: true,
        max: 50,
    },
    retailHoldings: {
        type: Number,
        required: true,
        max: 50,
    },
    stationaryTools: {
        type: Number,
        required: true,
        max: 50,
    },
    salaryUtilities: {
        type: Number,
        required: true,
        max: 50,
    },
    marketing: {
        type: Number,
        required: true,
        max: 50,
    },
    others: {
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

module.exports = mongoose.model('Expense', expenseSchema);