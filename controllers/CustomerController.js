const Customer = require('../models/Customer');
const { CustomerValidator } = require('../middlewares/Validator');
const CustomerController = {};

CustomerController.create = async (req, res) => {
  const { name, phone, address, amount, paid } = req.body;
  const validator = CustomerValidator({ name, phone, address });
  if (validator.error) {
    req.flash('error', validator.error);
    return res.redirect('/customers');
  }
  if (paid > amount) {
    req.flash('error', 'Paid amount cannot exceed more than the total amount.');
    return res.redirect('/customers');
  }
  const getCustomer = await Customer.findOne({ phone: validator.value.phone });
  if (getCustomer) {
    req.flash('error', 'Phone number must be unique. Customer already exists!');
    return res.redirect('/customers');
  }
  try {
    const { name, phone, address } = validator.value;
    customer = new Customer({ name, phone, address });
    await customer.save();
    req.flash('success', 'New customer has been successfully added!');
    return res.redirect('/customers');
  } catch (e) {
    req.flash('error', `Error While Saving Data - ${e}`);
    return res.redirect('/customers');
  }
};

CustomerController.read = async (req, res) => {
  const perPage = 30;
  const page = req.params.page || 1;
  let customers = Customer.find({});
  let count = await Customer.countDocuments();

  let queryString = {},
    countDocs;
  let matchObj = {
    phone: { $regex: req.query.searchQuery, $options: 'i' },
  };

  if (req.query.searchQuery) {
    customers = Customer.aggregate().match(matchObj);
    countDocs = Customer.aggregate().match(matchObj);
    queryString.query = req.query.searchQuery;
  }
  if (countDocs) {
    countDocs = await countDocs.exec();
    count = countDocs.length;
  }
  customers = await customers
    .skip(perPage * page - perPage)
    .limit(perPage)
    .sort({ createdAt: -1 })
    .exec();
  res.render('customers/index', {
    customers,
    queryString,
    current: page,
    pages: Math.ceil(count / perPage),
  });
};

CustomerController.delete = async (req, res) => {
  await Customer.deleteOne({ _id: req.params.id });
  req.flash('success', `Customer has been deleted successfully!`);
  res.redirect('/customers');
};

CustomerController.update = async (req, res) => {
  const { name, phone, address } = req.body;
  const validator = CustomerValidator({ name, phone, address });
  if (validator.error) {
    req.flash('error', validator.error);
    return res.redirect('/customers');
  } else {
    const { name, phone, address } = validator.value;
    const newCustomer = await Customer.findByIdAndUpdate(
      req.params.id,
      { $set: { name, phone, address } },
      { new: true }
    );
    req.flash(
      'success',
      `Customer info for "${newCustomer.name}" has been updated successfully!`
    );
    res.redirect('/customers');
  }
};

CustomerController.updateBalance = async (req, res) => {
  const { phone, paid } = req.body;
  const getCustomer = await Customer.findOne({ phone });
  if (!getCustomer) {
    req.flash('error', "Customers ID doesn't match. Try Again!");
    return res.redirect('/customers');
  }
  const newBalance = parseInt(paid);
  if (getCustomer.amount < newBalance + getCustomer.paid) {
    req.flash('error', 'Paid amount cannot exceed more than the total amount.');
    return res.redirect('/customers');
  }
  const newCustomer = await Customer.findByIdAndUpdate(
    getCustomer._id,
    { $inc: { paid: newBalance }, $set: { updatedAt: new Date() } },
    { new: true }
  );
  req.flash(
    'success',
    `New payment for "${newCustomer.name}" added successfully!`
  );
  res.redirect('/customers');
};

CustomerController.getCustomers = async (req, res) => {
  const customers = await Customer.find({});
  res.send(customers);
};

CustomerController.getCustomer = async (req, res) => {
  try {
    const { name, phone, address, amount, paid } = await Customer.findById(
      req.params.id
    );
    if (name) {
      return res.send({ name, phone, address, amount, paid });
    }
    return res.send("Customer Doesn't Exist");
  } catch (e) {
    return '';
  }
};

module.exports = CustomerController;
