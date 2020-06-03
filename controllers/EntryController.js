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
        const getProduct = await Product.findOne({
            code: validator.value.product,
        });
        entry = new Entry({
            product: getProduct._id,
            quantity: validator.value.quantity,
        });
    } catch (e) {
        req.flash('error', "Product Doesn't Exist");
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
    const perPage = 1;
    const page = req.params.page || 1;
    let entries = await Entry.find({ type: 'inventory' })
        .skip(perPage * page - perPage)
        .limit(perPage)
        .populate('product')
        .sort({ createdAt: -1 });
    let count = await Entry.find({ type: 'inventory' }).countDocuments();
    let queryString = '';
    if (req.query.searchQuery) {
        entries = await Entry.aggregate()
            .lookup({
                from: 'products',
                localField: 'product',
                foreignField: '_id',
                as: 'product',
            })
            .match({
                type: 'inventory',
                'product.code': { $regex: req.query.searchQuery, $options: 'i' },
            })
            .unwind({
                preserveNullAndEmptyArrays: true, // this remove the object which is null
                path: '$product',
            })
            .skip(perPage * page - perPage)
            .limit(perPage)
            .sort({ createdAt: -1 })
            .exec();
        let countDocs = await Entry.aggregate()
            .lookup({
                from: 'products',
                localField: 'product',
                foreignField: '_id',
                as: 'product',
            })
            .match({
                type: 'inventory',
                'product.code': { $regex: req.query.searchQuery, $options: 'i' },
            });
        count = countDocs.length;
        queryString = req.query.searchQuery;
    }

    res.render('entries/index', {
        entries,
        current: page,
        queryString,
        pages: Math.ceil(count / perPage),
    });
};

EntryController.delete = async (req, res) => {
    const entry = await Entry.findByIdAndDelete(req.params.id);
    req.flash('success', 'Entry has been deleted successfully!');
    res.redirect('/entries');
};

EntryController.update = async (req, res) => {
    const newEntry = await Entry.findByIdAndUpdate(
        req.params.id,
        { $set: req.body },
        { new: true }
    );
    const entries = await Entry.find({ product: newEntry.product });
    const newQuantity = entries.reduce((acc, curr) => acc + curr.quantity, 0);
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
