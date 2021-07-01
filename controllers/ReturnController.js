const ReturnModel = require('../models/Return');
const Product = require('../models/Product');
const Customer = require('../models/Customer');
const Entry = require('../models/Entry');
const Inventory = require('../models/Inventory');
const { ReturnValidator } = require('../middlewares/Validator');

const updateCustomerInfo = async (customer) => {
  const getReturns = await ReturnModel.find({ customer });
  let returnAmount = 0;

  if (getReturns) {
    getReturns.forEach((returnRecord) => {
      returnAmount += returnRecord.amount;
    });
  }

  await Customer.findByIdAndUpdate(customer, { $set: { returnAmount } });
};

const ReturnController = {};
ReturnController.create = async (req, res) => {
  const { customer, product, quantity, amount, returnDate } = req.body;
  const validator = ReturnValidator({ customer, product, quantity, amount });
  if (validator.error) {
    req.flash('error', validator.error);
    return res.redirect('/returns');
  }
  const getProduct = await Product.findOne({ code: validator.value.product });
  if (!getProduct) {
    req.flash('error', "Product code doesn't match. Try again!");
    return res.redirect('/returns');
  }
  const getCustomer = await Customer.findOne({
    phone: validator.value.customer,
  });
  if (!getCustomer) {
    req.flash('error', "User doesn't exist with this ID. Please try again!");
    return res.redirect('/returns');
  }
  const getInventory = await Inventory.findOne({ product: getProduct._id });
  if (getInventory.sales < quantity) {
    req.flash('error', `Oops! You can't return more products than sales.`);
    return res.redirect('/returns');
  }
  try {
    const { quantity, amount } = validator.value;
    const newEntry = await new Entry({
      product: getProduct._id,
      quantity,
      type: 'return',
    }).save();
    let setReturnDate = returnDate || new Date();

    const { customer } = await new ReturnModel({
      entry: newEntry._id,
      customer: getCustomer._id,
      product: getProduct._id,
      quantity,
      amount,
      returnDate: setReturnDate,
    }).save();
    await updateCustomerInfo(customer);

    req.flash('success', `A new Returns record has been added successfully!`);
    return res.redirect('/returns');
  } catch (e) {
    req.flash('error', `Error While Saving Data - ${e}`);
    return res.redirect('/returns');
  }
};

ReturnController.read = async (req, res) => {
  const perPage = 30;
  const page = req.params.page || 1;

  let returnRecords = ReturnModel.find({})
    .populate('product')
    .populate('customer');
  let count = await ReturnModel.countDocuments();

  let queryString = {},
    countDocs;
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
  let matchObj = {
    'customer.phone': { $regex: req.query.searchQuery, $options: 'i' },
  };

  if (req.query.searchQuery) {
    returnRecords = ReturnModel.aggregate()
      .lookup(lookUpProduct)
      .lookup(lookUpCustomer)
      .match(matchObj)
      .unwind({
        preserveNullAndEmptyArrays: true,
        path: '$customer',
      })
      .unwind({
        preserveNullAndEmptyArrays: true,
        path: '$product',
      });
    countDocs = ReturnModel.aggregate().lookup(lookUpProduct).match(matchObj);
    queryString.query = req.query.searchQuery;
  }
  if (req.query.startDate) {
    returnRecords = returnRecords.match({
      returnDate: { $gte: new Date(req.query.startDate) },
    });
    countDocs = countDocs.match({
      returnDate: { $gte: new Date(req.query.startDate) },
    });
    queryString.startDate = req.query.startDate;
  }
  if (req.query.endDate) {
    returnRecords = returnRecords.match({
      returnDate: { $lt: new Date(req.query.endDate) },
    });
    countDocs = countDocs.match({
      returnDate: { $lt: new Date(req.query.endDate) },
    });
    queryString.endDate = req.query.endDate;
  }
  if (countDocs) {
    countDocs = await countDocs.exec();
    count = countDocs.length;
  }

  returnRecords = await returnRecords
    .skip(perPage * page - perPage)
    .limit(perPage)
    .sort({ returnDate: -1 })
    .exec();
  returnRecords = returnRecords.filter(
    (returnRecord) => returnRecord.customer !== null
  );
  returnRecords = returnRecords.filter(
    (returnRecord) => returnRecord.product !== null
  );
  res.render('returns/index', {
    returnRecords,
    queryString,
    current: page,
    pages: Math.ceil(count / perPage),
  });
};

ReturnController.delete = async (req, res) => {
  const { customer, entry } = await ReturnModel.findById(req.params.id);
  await ReturnModel.findByIdAndDelete(req.params.id);
  await Entry.findByIdAndDelete(entry);
  await updateCustomerInfo(customer);

  req.flash('success', `Return has been deleted successfully!`);
  res.redirect('/returns');
};

ReturnController.update = async (req, res) => {
  const { entry, product, quantity, amount, returnDate } = req.body;
  const getProduct = await Product.findOne({ code: product });
  const getInventory = await Inventory.findOne({ product: getProduct._id });
  if (getInventory.sales < quantity) {
    req.flash('error', `Oops! You can't return more product than you sales.`);
    return res.redirect('/return');
  }
  await Entry.findByIdAndUpdate(entry, { $set: { quantity } });
  const updatedReturn = await ReturnModel.findByIdAndUpdate(req.params.id, {
    $set: { quantity, amount, returnDate },
  });
  await updateCustomerInfo(updatedReturn.customer);
  req.flash('success', `Returns information has been updated successfully!`);
  res.redirect('/returns');
};

ReturnController.getReturn = async (req, res) => {
  try {
    const { entry, customer, product, quantity, amount, returnDate } =
      await ReturnModel.findById(req.params.id)
        .populate('product')
        .populate('customer');
    const getProduct = await Product.findById(product);
    const getCustomer = await Customer.findById(customer);
    if (entry) {
      return res.send({
        entry,
        customer: getCustomer.phone,
        product: getProduct.code,
        quantity,
        amount,
        returnDate,
      });
    }
    return res.send("Return Doesn't Exist");
  } catch (e) {
    return '';
  }
};

module.exports = ReturnController;
