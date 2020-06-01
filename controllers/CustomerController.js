const Customer = require('../models/Customer');
const Sale = require('../models/Sale');
const ReturnModel = require('../models/Return');
const { CustomerValidator } = require('../middlewares/Validator');
const CustomerController = {};


CustomerController.create = async (req, res) => {
    const { name, phone, address, amount, paid } = req.body;
    const validator = CustomerValidator({ name, phone, address, amount, paid });
    if (validator.error) {
        req.flash('error', validator.error);
        return res.redirect('/customers');
    }
    if(paid > amount) {
        req.flash('error', 'Paid amount cannot exceed more than the total amount.');
        return res.redirect('/customers');
    }
    const getCustomer = await Customer.findOne({ phone: validator.value.phone });
    if(getCustomer) {
        req.flash('error', 'Phone number must be unique. Customer already exists!');
        return res.redirect('/customers');
    }
    try {
        const { name, phone, address, amount, paid } = validator.value;
        customer = new Customer({ name, phone, address, amount, paid });
        await customer.save();
        req.flash('success', 'New customer has been successfully added!');
        return res.redirect('/customers');
    } catch (e) {
        req.flash('error', `Error While Saving Data - ${e}`);
        return res.redirect('/customers');
    }
};


CustomerController.read = async (req, res) => {
    const getSales = await Sale.find({});
    const getReturn = await ReturnModel.find({});
    const getCustomers = await Customer.find({});
    let customerRecords = {}
    getCustomers.forEach((customer) => {
        let totalAmount = 0, totalPaid = 0, totalReturn = 0;
        customerID = customer.id;
        getSales.forEach(sale => {
            if(sale.customer == customerID){
                totalAmount += sale.amount;
                totalPaid += sale.paid;
            }
            customerRecords[customerID] = { total: totalAmount, paid: totalPaid, due: (totalAmount - totalPaid) };
        });
        getReturn.forEach(returnRecord => {
            if(returnRecord.customer == customerID){
                totalReturn += returnRecord.amount;
            }
            customerRecords[customerID].returnAmount = totalReturn;
        });
    });
    for(const id in customerRecords){
        await Customer.findByIdAndUpdate(id, {$set: {
            amount: (customerRecords[id].total - customerRecords[id].returnAmount),
            paid: customerRecords[id].paid,
            due: customerRecords[id].due,
        }});
    }

    const perPage = 30;
    const page = req.params.page || 1;
    const customers = await Customer.find({}).skip((perPage * page) - perPage).limit(perPage).sort({createdAt: -1});
    const count =  await Customer.countDocuments();
    res.render('customers/index', { customers, current: page, pages: Math.ceil(count / perPage)});
};


CustomerController.delete = async (req, res) => {
    await Customer.findByIdAndDelete(req.params.id);
    req.flash('success', `Customer has been deleted successfully!`);
    res.redirect('/customers');
};


CustomerController.update = async (req, res) => {
    const { name, phone, address } = req.body;
    const validator = CustomerValidator({ name, phone, address });
    if (validator.error) {
        req.flash('error', validator.error);
        return res.redirect('/customers');
    } else {
        const { name, phone, address } = validator.value;
        const newCustomer = await Customer.findByIdAndUpdate(req.params.id, { $set: {name, phone, address}},
            { new: true });
        req.flash('success', `Customer info for "${newCustomer.name}" has been updated successfully!`);
        res.redirect('/customers');
    }
};

CustomerController.updateBalance = async (req, res) => {
    const {phone, paid} = req.body;
    const getCustomer = await Customer.findOne({ phone });
    if(!getCustomer) {
        req.flash('error', 'Customers ID doesn\'t match. Try Again!');
        return res.redirect('/customers');
    }
    const newBalance = parseInt(paid);
    if(getCustomer.amount <  (newBalance + getCustomer.paid)){
        req.flash('error', 'Paid amount cannot exceed more than the total amount.');
        return res.redirect('/customers');
    }
    const newCustomer = await Customer.findByIdAndUpdate(getCustomer._id,
        { $inc: {paid: newBalance}, $set: {updatedAt: new Date()}}, { new: true });
    req.flash('success', `New payment for "${newCustomer.name}" added successfully!`);
    res.redirect('/customers');
};


CustomerController.getCustomers = async (req, res) => {
    const customers = await Customer.find({});
    res.send(customers);
};


CustomerController.getCustomer = async (req, res) => {
    try {
        const { name, phone, address, amount, paid  } = await Customer.findById(req.params.id);
        if (name) {
            return res.send({ name, phone, address, amount, paid });
        }
        return res.send("Customer Doesn't Exist");
    } catch (e) {
        return '';
    }
};


module.exports = CustomerController;
