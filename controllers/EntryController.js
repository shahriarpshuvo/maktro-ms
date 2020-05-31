/* eslint-disable no-underscore-dangle */
const Entry = require('../models/Entry');
const Inventory = require('../models/Inventory');
const Product = require('../models/Product');
const { EntryValidator } = require('../middlewares/Validator');

const EntryController = {};

EntryController.create = async (req, res) => {
    const { product, quantity } = req.body;
    const validator = EntryValidator({ product, quantity });
    if (validator.error) {
        req.flash('error', validator.error);
        return res.redirect('/inventories');
    }
    let entry;
    try {
        const getProduct = await Product.findOne({ code: validator.value.product });
        await Inventory.findOneAndUpdate({ product: getProduct._id },
            { $inc: { quantity: validator.value.quantity } });
        entry = new Entry({
            product: getProduct._id,
            quantity: validator.value.quantity,
        });
    } catch (e) {
        req.flash('error', 'Product Doesn\'t Exist');
        return res.redirect('/inventories');
    }
    try {
        await entry.save();
        req.flash('success', 'New inventory has been successfully added!');
        return res.redirect('/inventories');
    } catch (e) {
        req.flash('error', `Error While Saving Data - ${e}`);
        return res.redirect('/inventories');
    }
};

EntryController.read = async (req, res) => {
    const entries = await Entry.find({}).populate('product').sort({ createdAt: -1 });
    res.render('entries/index', { entries });
};

EntryController.delete = async (req, res) => {
    const entry = await Entry.findById(req.params.id);
    await Inventory.findOneAndUpdate({ product: entry.product },
        { $inc: { quantity: -entry.quantity } });
    entry.remove();
    req.flash('success', 'Entry has been deleted successfully!');
    res.redirect('/entries');
};

EntryController.update = async (req, res) => {
    const newEntry = await Entry.findByIdAndUpdate(req.params.id,
        { $set: req.body }, { new: true });
    const entries = await Entry.find({ product: newEntry.product });
    const newQuantity = entries.reduce((acc, curr) => acc + curr.quantity, 0);
    await Inventory.findOneAndUpdate({ product: newEntry.product },
        { $set: { quantity: newQuantity } });
    req.flash('success', 'Entry has been updated successfully!');
    res.redirect('/entries');
};

// API
EntryController.getEntry = async (req, res) => {
    try {
        const entry = await Entry.findById(req.params.id).populate('product');
        if (entry) {
            return res.send({
                product: entry.product.code,
                quantity: entry.quantity,
            });
        }
        return res.send("Entry Doesn't Exist");
    } catch (e) {
        return '';
    }
};
module.exports = EntryController;
