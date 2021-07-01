const Sale = require('../models/Sale');
const Product = require('../models/Product');
const Customer = require('../models/Customer');
const Inventory = require('../models/Inventory');
const Entry = require('../models/Entry');
const ReturnModel = require('../models/Return');
const generateInvoice = require('../middlewares/InvoiceGenerator');

const { SaleValidator } = require('../middlewares/Validator');

const SaleController = {};

const updateCustomerInfo = async (customer) => {
  const getSales = await Sale.find({ customer });
  const getReturn = await ReturnModel.find({ customer });

  let amount = 0,
    paid = 0,
    returnAmount = 0;

  if (getSales) {
    getSales.forEach((sale) => {
      amount += sale.amount;
      paid += sale.paid;
    });
  }

  if (getReturn) {
    getReturn.forEach((returnRecord) => {
      returnAmount += returnRecord.amount;
    });
  }

  let due = amount - paid;
  let profit = amount - returnAmount;

  await Customer.findByIdAndUpdate(customer, {
    $set: { amount, paid, returnAmount, due, profit },
  });
};

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
    comment,
  } = req.body;
  const validator = SaleValidator({
    customer,
    product,
    quantity,
    rate,
    shippingCost,
    discount,
    paid,
    salesDate,
  });
  if (validator.error) {
    req.flash('error', validator.error);
    return res.redirect('/sales');
  }
  const getProduct = await Product.findOne({
    code: validator.value.product,
  });
  if (!getProduct) {
    req.flash('error', "Product code doesn't match. Try again!");
    return res.redirect('/sales');
  }
  const getCustomer = await Customer.findOne({
    phone: validator.value.customer,
  });
  if (!getCustomer) {
    req.flash('error', "User doesn't exist with this ID. Please try again!");
    return res.redirect('/sales');
  }
  const getInventory = await Inventory.findOne({
    product: getProduct._id,
  });
  if (getInventory.quantity <= 0 || getInventory.quantity < quantity) {
    req.flash(
      'error',
      `Oops! Insufficient amount of product in the inventory.`
    );
    return res.redirect('/sales');
  }
  try {
    const { quantity, rate, shippingCost, discount, paid, salesDate } =
      validator.value;
    const amount =
      parseInt(quantity) * parseInt(rate) +
      parseInt(shippingCost) -
      parseInt(discount);
    const newEntry = await new Entry({
      product: getProduct._id,
      quantity,
      type: 'sale',
      createdAt: salesDate,
    }).save();
    const newSale = await new Sale({
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
      comment,
    }).save();

    await updateCustomerInfo(newSale.customer);

    generateInvoice(newSale._id, '');
    req.flash(
      'success',
      `Congratulation on new Sales! Record has been added successfully.`
    );
    return res.redirect('/sales');
  } catch (e) {
    req.flash('error', `Error While Saving Data - ${e}`);
    return res.redirect('/sales');
  }
};

SaleController.addBalance = async (req, res) => {
  const { customer, paid, comment } = req.body;
  const getCustomer = await Customer.findOne({
    phone: customer,
  });

  if (!getCustomer) {
    req.flash('error', "User doesn't exist with this ID. Please try again!");
    return res.redirect('/sales');
  }
  try {
    const newSale = await new Sale({
      customer: getCustomer._id,
      paid,
      comment,
    }).save();

    await updateCustomerInfo(newSale.customer);

    generateInvoice(newSale._id, 'payment');
    req.flash(
      'success',
      `Balance has been added successfully for "${getCustomer.name}".`
    );
    return res.redirect('/sales');
  } catch (e) {
    req.flash('error', `Error While Saving Data - ${e}`);
    return res.redirect('/sales');
  }
};

SaleController.read = async (req, res) => {
  const perPage = 30;
  const page = req.params.page || 1;
  let sales = Sale.find({}).populate('product').populate('customer');
  let count = await Sale.countDocuments();

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
    sales = Sale.aggregate()
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
    countDocs = Sale.aggregate().lookup(lookUpProduct).match(matchObj);
    queryString.query = req.query.searchQuery;
  }
  if (req.query.startDate) {
    sales = sales.match({
      salesDate: { $gte: new Date(req.query.startDate) },
    });
    countDocs = countDocs.match({
      salesDate: { $gte: new Date(req.query.startDate) },
    });
    queryString.startDate = req.query.startDate;
  }
  if (req.query.endDate) {
    sales = sales.match({
      salesDate: { $lt: new Date(req.query.endDate) },
    });
    countDocs = countDocs.match({
      salesDate: { $lt: new Date(req.query.endDate) },
    });
    queryString.endDate = req.query.endDate;
  }
  if (countDocs) {
    countDocs = await countDocs.exec();
    count = countDocs.length;
  }

  sales = await sales
    .skip(perPage * page - perPage)
    .limit(perPage)
    .sort({ createdAt: -1 })
    .exec();

  sales = sales.filter((sale) => sale.customer !== null);
  sales = sales.filter((sale) => sale.product !== null);

  res.render('sales/index', {
    sales,
    queryString,
    current: page,
    pages: Math.ceil(count / perPage),
  });
};

SaleController.delete = async (req, res) => {
  const { customer, entry } = await Sale.findById(req.params.id);
  await Sale.findByIdAndDelete(req.params.id);
  await Entry.findByIdAndDelete(entry);
  await updateCustomerInfo(customer);
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
    comment,
  } = req.body;
  const getProduct = await Product.findOne({
    code: product,
  });
  if (!getProduct) {
    req.flash('error', "Product code doesn't match. Try again!");
    return res.redirect('/sales');
  }
  const getInventory = await Inventory.findOne({
    product: getProduct._id,
  });
  if (getInventory.quantity <= 0 || getInventory.quantity < quantity) {
    req.flash(
      'error',
      `Oops! Insufficient amount of product in the inventory.`
    );
    return res.redirect('/sales');
  }
  const amount =
    parseInt(quantity) * parseInt(rate) +
    parseInt(shippingCost) -
    parseInt(discount);
  await Entry.findByIdAndUpdate(entry, {
    $set: {
      quantity,
      createdAt: salesDate,
    },
  });
  const updatedSale = await Sale.findOneAndUpdate(
    { _id: req.params.id },
    {
      $set: {
        quantity,
        rate,
        shippingCost,
        discount,
        paid,
        amount,
        salesDate,
        comment,
      },
    }
  );

  await updateCustomerInfo(updatedSale.customer);
  generateInvoice(updatedSale._id, '');
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
      comment,
    } = await Sale.findById(req.params.id)
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
        rate,
        shippingCost,
        discount,
        amount,
        paid,
        salesDate,
        comment,
      });
    }
    return res.send("Sale Doesn't Exist");
  } catch (e) {
    return '';
  }
};

module.exports = SaleController;
