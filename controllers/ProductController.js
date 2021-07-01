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
    req.flash(
      'error',
      `A product with "${existProduct.code}" has already existed!`
    );
    return res.redirect('/products');
  }

  try {
    const { name, code, rate } = validator.value;
    const savedProduct = await new Product({ name, code, rate }).save();
    await new Inventory({
      product: savedProduct._id,
    }).save();
    req.flash(
      'success',
      `Product (${savedProduct.name}) has been successfully added!`
    );
    return res.redirect('/products');
  } catch (e) {
    req.flash('error', `Error While Saving Data - ${e}`);
    return res.redirect('/products');
  }
};

ProductController.read = async (req, res) => {
  const perPage = 30;
  const page = req.params.page || 1;
  let products = Product.find({});
  let count = await Product.countDocuments();

  let queryString = {},
    countDocs;
  let matchObj = {
    code: { $regex: req.query.searchQuery, $options: 'i' },
  };

  if (req.query.searchQuery) {
    products = Product.aggregate().match(matchObj);
    countDocs = Product.aggregate().match(matchObj);
    queryString.query = req.query.searchQuery;
  }
  if (countDocs) {
    countDocs = await countDocs.exec();
    count = countDocs.length;
  }

  products = await products
    .skip(perPage * page - perPage)
    .limit(perPage)
    .sort({ createdAt: -1 })
    .exec();
  res.render('products/index', {
    products,
    queryString,
    current: page,
    pages: Math.ceil(count / perPage),
  });
};

ProductController.update = async (req, res) => {
  const product = await Product.findByIdAndUpdate(
    req.params.id,
    { $set: req.body },
    { new: true }
  );
  req.flash(
    'success',
    `Product (${product.name}) has been updated successfully!`
  );
  res.redirect('/products');
};

ProductController.delete = async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  await Inventory.findOneAndDelete({ product: req.params.id });
  req.flash(
    'success',
    `Product (${product.name}) has been deleted successfully!`
  );
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
