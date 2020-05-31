const Sale = require('../models/Sale');
const Product = require('../models/Product');
const Customer = require('../models/Customer');
const Entry = require('../models/Entry');
const { SaleValidator } = require('../middlewares/Validator');

const SaleController = {};

SaleController.create = async (req, res) => {
    const { customer, product, quantity, rate, shippingCost, discount, paid, salesDate } = req.body;
    const validator = SaleValidator({ customer, product, quantity, rate, shippingCost, discount, paid, salesDate });
    if (validator.error) {
        req.flash('error', validator.error);
        return res.redirect('/sales');
    }
    const getProduct = await Product.findOne({code: validator.value.product});
    if(!getProduct) {
        req.flash('error', 'Product code doesn\'t match. Try again!');
        return res.redirect('/sales');
    }
    const getCustomer = await Customer.findOne({phone: validator.value.customer});
    if(!getCustomer) {
        req.flash('error', 'User doesn\'t exist with this ID. Please try again!');
        return res.redirect('/sales');
    }
    try{
        const { quantity, rate, shippingCost, discount, paid, salesDate } = validator.value;
        const amount = (parseInt(quantity) * parseInt(rate)) + parseInt(shippingCost) - parseInt(discount);
        const newEntry = await new Entry({
            product: getProduct._id,
            quantity,
            type: 'sale'
        }).save();
        await new Sale({
            entry: newEntry._id, customer: getCustomer._id, product: getProduct._id,
            quantity, rate, shippingCost, discount, amount, paid, salesDate
        }).save();
        req.flash('success', `Congratulation on new Sales! Record has been added successfully.`);
        return res.redirect('/sales');
    } catch (e) {
        req.flash('error', `Error While Saving Data - ${e}`);
        return res.redirect('/sales');
    }
};

SaleController.read = async (req, res) => {
    const sales = await Sale.find({}).populate('product').populate('customer').sort({createdAt: -1});
    res.render('sales/index', { sales });
};

SaleController.delete = async (req, res) => {
    const getSale = await Sale.findByIdAndDelete(req.params.id);
    await Entry.findByIdAndDelete(getSale.entry);
    req.flash('success', `Sale has been deleted successfully!`);
    res.redirect('/sales');
};

SaleController.update = async (req, res) => {
    const { entry, quantity, rate, shippingCost, discount, paid, salesDate } = req.body;
    const amount = (parseInt(quantity) * parseInt(rate)) + parseInt(shippingCost) - parseInt(discount);
    await Entry.findByIdAndUpdate(entry, {$set: {quantity}});
    const newSale = await Sale.findByIdAndUpdate(req.params.id, { $set: {quantity, rate, shippingCost, discount, paid, amount, salesDate}}, { new: true });
    req.flash('success', `Sales information has been updated successfully!`);
    res.redirect('/sales');
};

//API
SaleController.getSale = async (req, res) => {
    try {
        const { entry, customer, product, quantity, rate, shippingCost, discount, amount, paid, salesDate } = await Sale.findById(req.params.id).populate('product').populate('customer');
        const getProduct = await Product.findById(product);
        const getCustomer = await Customer.findById(customer);
        if (entry) {
            return res.send({
                entry, customer: getCustomer.phone, product: getProduct.code, quantity, rate, shippingCost, discount, amount, paid, salesDate
            });
        }
        return res.send("Sale Doesn't Exist");
    } catch (e) {
        return '';
    }
};


module.exports = SaleController;
