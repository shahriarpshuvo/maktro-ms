const mongoose = require('mongoose');
// Independent Schema
const expenseSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        max: 100,
    },
    equipments: {},
    transports: {},
    courierCommission: {},
    retailHoldings: {},
    stationaryTools: {},
    salaryUtilities: {},
    marketing: {},
    others: {},
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
