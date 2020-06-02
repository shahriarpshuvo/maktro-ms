const Sale = require('../models/Sale');
const Product = require('../models/Product');
const Customer = require('../models/Customer');
const Inventory = require('../models/Inventory');
const Entry = require('../models/Entry');
const ReturnModel = require('../models/Return');

const {
    SaleValidator
} = require('../middlewares/Validator');

const SaleController = {};


const updateCustomerInfo = async () => {
    const getSales = await Sale.find({});
    const getReturn = await ReturnModel.find({});
    const getCustomers = await Customer.find({});

    let customerRecords = {}
    getCustomers.forEach((customer) => {
        let totalAmount = 0,
            totalPaid = 0,
            totalReturn = 0;
        customerID = customer.id;
        if (getSales) {
            getSales.forEach(sale => {
                if (sale.customer == customerID) {
                    totalAmount += sale.amount;
                    totalPaid += sale.paid;
                }
                customerRecords[customerID] = {
                    total: totalAmount,
                    paid: totalPaid
                };
            });
        }
        if(getReturn){
            getReturn.forEach(returnRecord => {
                if(returnRecord.customer == customerID){
                    totalReturn += returnRecord.amount;
                }
                customerRecords[customerID].returnAmount = totalReturn;
            });
        }
    });

  
    for(const id in customerRecords){
        console.log(customerRecords);
        let returnAmount = customerRecords[id].returnAmount || 0;
        let amount = customerRecords[id].total || 0;
        let paid = customerRecords[id].paid || 0;
        let due = amount - paid;
        let profit = amount - returnAmount;
        await Customer.findByIdAndUpdate(id, {$set: { amount, paid, due, returnAmount, profit }});
    }
}

SaleController.create = async (req, res) => {
    const {
        customer,
        product,
        quantity,
        rate,
        shippingCost,
        discount,
        paid,
        salesDate,
        comment
    } = req.body;
    const validator = SaleValidator({
        customer,
        product,
        quantity,
        rate,
        shippingCost,
        discount,
        paid,
        salesDate
    });
    if (validator.error) {
        req.flash('error', validator.error);
        return res.redirect('/sales');
    }
    const getProduct = await Product.findOne({
        code: validator.value.product
    });
    if (!getProduct) {
        req.flash('error', 'Product code doesn\'t match. Try again!');
        return res.redirect('/sales');
    }
    const getCustomer = await Customer.findOne({
        phone: validator.value.customer
    });
    if (!getCustomer) {
        req.flash('error', 'User doesn\'t exist with this ID. Please try again!');
        return res.redirect('/sales');
    }
    const getInventory = await Inventory.findOne({
        product: getProduct._id
    });
    if (getInventory.quantity <= 0 || getInventory.quantity < quantity) {
        req.flash('error', `Oops! Insufficient amount of product in the inventory.`);
        return res.redirect('/sales');
    }
    try {
        const {
            quantity,
            rate,
            shippingCost,
            discount,
            paid,
            salesDate
        } = validator.value;
        const amount = (parseInt(quantity) * parseInt(rate)) + parseInt(shippingCost) - parseInt(discount);
        const newEntry = await new Entry({
            product: getProduct._id,
            quantity,
            type: 'sale'
        }).save();
        await new Sale({
            entry: newEntry._id,
            customer: getCustomer._id,
            product: getProduct._id,
            quantity,
            rate,
            shippingCost,
            discount,
            amount,
            paid,
            salesDate,
            comment
        }).save();
        updateCustomerInfo();
        req.flash('success', `Congratulation on new Sales! Record has been added successfully.`);
        return res.redirect('/sales');
    } catch (e) {
        req.flash('error', `Error While Saving Data - ${e}`);
        return res.redirect('/sales');
    }
};


SaleController.read = async (req, res) => {
    const perPage = 30;
    const page = req.params.page || 1;
    const sales = await Sale.find({}).skip((perPage * page) - perPage).limit(perPage).populate('product').populate('customer').sort({
        createdAt: -1
    });
    const count = await Sale.countDocuments();
    updateCustomerInfo();
    res.render('sales/index', {
        sales,
        current: page,
        pages: Math.ceil(count / perPage)
    });
};


SaleController.delete = async (req, res) => {
    const getSale = await Sale.findByIdAndDelete(req.params.id);
    await Entry.findByIdAndDelete(getSale.entry);
    updateCustomerInfo();
    req.flash('success', `Sale has been deleted successfully!`);
    res.redirect('/sales');
};


SaleController.update = async (req, res) => {
    const {
        entry,
        product,
        quantity,
        rate,
        shippingCost,
        discount,
        paid,
        salesDate,
        comment
    } = req.body;
    const getProduct = await Product.findOne({
        code: product
    });
    if (!getProduct) {
        req.flash('error', 'Product code doesn\'t match. Try again!');
        return res.redirect('/sales');
    }
    const getInventory = await Inventory.findOne({
        product: getProduct._id
    });
    if (getInventory.quantity <= 0 || getInventory.quantity < quantity) {
        req.flash('error', `Oops! Insufficient amount of product in the inventory.`);
        return res.redirect('/sales');
    }
    const amount = (parseInt(quantity) * parseInt(rate)) + parseInt(shippingCost) - parseInt(discount);
    await Entry.findByIdAndUpdate(entry, {
        $set: {
            quantity
        }
    });
    await Sale.findByIdAndUpdate(req.params.id, {
        $set: {
            quantity,
            rate,
            shippingCost,
            discount,
            paid,
            amount,
            salesDate,
            comment
        }
    });
    updateCustomerInfo();
    req.flash('success', `Sales information has been updated successfully!`);
    res.redirect('/sales');
};


// API
SaleController.getSale = async (req, res) => {
    try {
        const {
            entry,
            customer,
            product,
            quantity,
            rate,
            shippingCost,
            discount,
            amount,
            paid,
            salesDate,
            comment
        } = await Sale.findById(req.params.id).populate('product').populate('customer');
        const getProduct = await Product.findById(product);
        const getCustomer = await Customer.findById(customer);
        if (entry) {
            return res.send({
                entry,
                customer: getCustomer.phone,
                product: getProduct.code,
                quantity,
                rate,
                shippingCost,
                discount,
                amount,
                paid,
                salesDate,
                comment
            });
        }
        return res.send("Sale Doesn't Exist");
    } catch (e) {
        return '';
    }
};


module.exports = SaleController;
