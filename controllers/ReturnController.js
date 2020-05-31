const ReturnModel = require('../models/Return');
const Product = require('../models/Product');
const Customer = require('../models/Customer');
const Entry = require('../models/Entry');
const { ReturnValidator } = require('../middlewares/Validator');

const ReturnController = {};

ReturnController.create = async (req, res) => {
    const { customer, product, quantity, rate, shippingCost, discount, paid} = req.body;
    const validator = ReturnValidator({ customer, product, quantity, rate, shippingCost, discount, paid, ReturnsDate });
    if (validator.error) {
        req.flash('error', validator.error);
        return res.redirect('/Returns');
    }
    const getProduct = await Product.findOne({code: validator.value.product});
    if(!getProduct) {
        req.flash('error', 'Product code doesn\'t match. Try again!');
        return res.redirect('/Returns');
    }
    const getCustomer = await Customer.findOne({phone: validator.value.customer});
    if(!getCustomer) {
        req.flash('error', 'User doesn\'t exist with this ID. Please try again!');
        return res.redirect('/Returns');
    }
    try{
        const { quantity, rate, shippingCost, discount, paid, ReturnsDate } = validator.value;
        const amount = (parseInt(quantity) * parseInt(rate)) + parseInt(shippingCost) - parseInt(discount);
        const newEntry = await new Entry({
            product: getProduct._id,
            quantity,
            type: 'Return'
        }).save();
        await new Return({
            entry: newEntry._id, customer: getCustomer._id, product: getProduct._id,
            quantity, rate, shippingCost, discount, amount, paid, ReturnsDate
        }).save();
        req.flash('success', `Congratulation on new Returns! Record has been added successfully.`);
        return res.redirect('/Returns');
    } catch (e) {
        req.flash('error', `Error While Saving Data - ${e}`);
        return res.redirect('/Returns');
    }
};

ReturnController.read = async (req, res) => {
    const Returns = await ReturnModel.find({}).populate('product').sort({createdAt: -1});
    res.render('Returns/index', { Returns });
};

ReturnController.delete = async (req, res) => {
    const getReturn = await Return.findByIdAndDelete(req.params.id);
    await Entry.findByIdAndDelete(getReturn.entry);
    req.flash('success', `Return has been deleted successfully!`);
    res.redirect('/Returns');
};

ReturnController.update = async (req, res) => {
    const { entry, quantity, rate, shippingCost, discount, paid, ReturnsDate } = req.body;
    const amount = (parseInt(quantity) * parseInt(rate)) + parseInt(shippingCost) - parseInt(discount);
    await Entry.findByIdAndUpdate(entry, {$set: {quantity}});
    const newReturn = await Return.findByIdAndUpdate(req.params.id, { $set: {quantity, rate, shippingCost, discount, paid, amount, ReturnsDate}}, { new: true });
    req.flash('success', `Returns information has been updated successfully!`);
    res.redirect('/Returns');
};

// API
ReturnController.getReturn = async (req, res) => {
    try {
        const { entry, customer, product, quantity, rate, shippingCost, discount, amount, paid, ReturnsDate } = await Return.findById(req.params.id).populate('product').populate('customer');
        const getProduct = await Product.findById(product);
        const getCustomer = await Customer.findById(customer);
        if (entry) {
            return res.send({
                entry, customer: getCustomer.phone, product: getProduct.code, quantity, rate, shippingCost, discount, amount, paid, ReturnsDate
            });
        }
        return res.send("Return Doesn't Exist");
    } catch (e) {
        return '';
    }
};


module.exports = ReturnController;
