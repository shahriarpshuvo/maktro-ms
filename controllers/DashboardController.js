const Expense = require('../models/Expense');

const DashboardController = {};


DashboardController.read = async (req, res) => {




    let expenses = Expense.aggregate().match({});
    let totalExp = 0, queryString={}, expTypes = req.query.expcat;
    if(req.query.startDate){
        expenses = expenses.match({ expenseDate: {$gte: new Date(req.query.startDate)}});
        queryString.startDate = req.query.startDate;
    }
    if(req.query.endDate){
        expenses= expenses.match({ expenseDate: {$lt: new Date(req.query.endDate)}});
        queryString.endDate = req.query.endDate;
    }
    expenses = await expenses.exec();
    if(expenses){
        if(expTypes) totalExp = expenses.reduce((acc, curr) => acc + curr[expTypes], 0);
        else totalExp = expenses.reduce((acc, curr) => acc + curr.amount, 0);
        queryString.expcat = expTypes;
    }
    res.render('dashboard/index', {totalExp, queryString});
};



module.exports = DashboardController;
