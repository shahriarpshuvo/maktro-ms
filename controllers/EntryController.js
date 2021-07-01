/* eslint-disable no-underscore-dangle */
const Entry = require('../models/Entry');
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
  const perPage = 30;
  const page = req.params.page || 1;
  let entries = Entry.find({ type: 'inventory' }).populate('product');
  let count = await Entry.find({ type: 'inventory' }).countDocuments();

  let lookUpProduct = {
    from: 'products',
    localField: 'product',
    foreignField: '_id',
    as: 'product',
  };
  let matchObj = {
    type: 'inventory',
    'product.code': { $regex: req.query.searchQuery, $options: 'i' },
  };
  let queryString = {},
    countDocs;
  if (req.query.searchQuery) {
    entries = Entry.aggregate().lookup(lookUpProduct).match(matchObj).unwind({
      preserveNullAndEmptyArrays: true,
      path: '$product',
    });
    countDocs = Entry.aggregate().lookup(lookUpProduct).match(matchObj);
    queryString.query = req.query.searchQuery;
  }
  if (req.query.startDate) {
    entries = entries.match({
      createdAt: { $gte: new Date(req.query.startDate) },
    });
    countDocs = countDocs.match({
      createdAt: { $gte: new Date(req.query.startDate) },
    });
    queryString.startDate = req.query.startDate;
  }
  if (req.query.endDate) {
    entries = entries.match({
      createdAt: { $lt: new Date(req.query.endDate) },
    });
    countDocs = countDocs.match({
      createdAt: { $lt: new Date(req.query.endDate) },
    });
    queryString.endDate = req.query.endDate;
  }
  if (countDocs) {
    countDocs = await countDocs.exec();
    count = countDocs.length;
  }

  entries = await entries
    .skip(perPage * page - perPage)
    .limit(perPage)
    .sort({ createdAt: -1 })
    .exec();
  res.render('entries/index', {
    entries,
    current: page,
    queryString,
    pages: Math.ceil(count / perPage),
  });
};

EntryController.delete = async (req, res) => {
  await Entry.findByIdAndDelete(req.params.id);
  req.flash('success', 'Entry has been deleted successfully!');
  res.redirect('/entries');
};

EntryController.update = async (req, res) => {
  const newEntry = await Entry.findByIdAndUpdate(
    req.params.id,
    { $set: req.body },
    { new: true }
  );
  await Entry.find({ product: newEntry.product });
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
