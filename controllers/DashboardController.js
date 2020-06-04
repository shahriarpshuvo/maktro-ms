const Expense = require('../models/Expense');
const Sale = require('../models/Sale');

const DashboardController = {};


DashboardController.read = async (req, res) => {
    let queryString={};
    queryString.overview = 'sales';
    let lookUpProduct = {
        from: 'products',
        localField: 'product',
        foreignField: '_id',
        as: 'product',
    };
    let lookUpCustomer = {
        from: 'customers',
        localField: 'customer',
        foreignField: '_id',
        as: 'customer',
    };

    let sales = Sale.aggregate().lookup(lookUpProduct).lookup(lookUpCustomer).unwind({
        preserveNullAndEmptyArrays: true,
        path: '$customer',
    }).unwind({
        preserveNullAndEmptyArrays: true,
        path: '$product',
    });

    if (req.query.salesType == 'customer' && req.query.salesQuery) {
        sales = sales.match({'customer.phone': req.query.salesQuery});
        queryString.salesType = req.query.salesType;
        queryString.startDate = req.query.salesQuery;
    }
    if (req.query.salesType == 'product' && req.query.salesQuery) {
        sales = sales.match({'product.code': req.query.salesQuery});
        queryString.salesType = req.query.salesType;
        queryString.salesQuery = req.query.salesQuery;
    }

    if(req.query.startDateSales){
        sales = sales.match({ salesDate: {$gte: new Date(req.query.startDateSales)} });
        queryString.startDateSales = req.query.startDateSales;
    }
    if(req.query.endDateSales){
        sales = sales.match({ salesDate: {$lt: new Date(req.query.endDateSales)}});
        queryString.endDateSales = req.query.endDateSales;
    }
    sales = await sales.exec();
    const totalSales = sales.reduce((acc, curr) => acc + curr.amount, 0);
    const totalPaid = sales.reduce((acc, curr) => acc + curr.paid, 0);
    const totalDue = totalSales - totalPaid;
    const salesData = { totalSales, totalPaid, totalDue };
    let expenses = Expense.aggregate().match({});
    let totalExp = 0, expTypes = req.query.expcat;
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
    if(expTypes) queryString.overview = 'expense';
    res.render('dashboard/index', {totalExp, queryString, salesData});
};


module.exports = DashboardController;
