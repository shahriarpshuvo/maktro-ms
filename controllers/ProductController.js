const Product = require('../models/Product');
const Inventory = require('../models/Inventory');
const { ProductValidator } = require('../middlewares/Validator');

const ProductController = {};

ProductController.create = async (req, res) => {
    const { name, code, rate } = req.body;
    const validator = ProductValidator({ name, code, rate });
    if (validator.error) {
        req.flash('error', validator.error);
        return res.redirect('/products');
    }
    const existProduct = await Product.findOne({ code: validator.value.code });
    if (existProduct) {
        req.flash('error', `A product with "${existProduct.code}" has already existed!`);
        return res.redirect('/products');
    }

    try {
        const { name, code, rate } = validator.value;
        const savedProduct = await new Product({ name, code, rate }).save();
        await new Inventory({
            product: savedProduct._id,
        }).save();
        req.flash('success', `Product (${savedProduct.name}) has been successfully added!`);
        return res.redirect('/products');
    } catch (e) {
        req.flash('error', `Error While Saving Data - ${e}`);
        return res.redirect('/products');
    }
};

ProductController.read = async (req, res) => {
    const products = await Product.find({}).sort({createdAt: -1});
    res.render('products/index', { products });
};

ProductController.update = async (req, res) => {
    const product = await Product.findByIdAndUpdate(req.params.id,
        { $set: req.body },
        { new: true });
    req.flash('success', `Product (${product.name}) has been updated successfully!`);
    res.redirect('/products');
};


ProductController.delete = async (req, res) => {
    const product = await Product.findByIdAndDelete(req.params.id);
    await Inventory.findOneAndDelete({product: req.params.id});
    req.flash('success', `Product (${product.name}) has been deleted successfully!`);
    res.redirect('/products');
};

// API
ProductController.getProducts = async (req, res) => {
    const products = await Product.find({});
    res.send(products);
};

ProductController.getProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (product) return res.send(product);
        return res.send("User Doesn't Exist");
    } catch (e) {
        return '';
    }
};

module.exports = ProductController;
