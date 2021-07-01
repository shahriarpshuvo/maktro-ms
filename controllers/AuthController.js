const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { LoginValidator } = require('../middlewares/Validator');
AuthController = {};

AuthController.read = (req, res) => {
  if (req.session.user) {
    return res.redirect('/dashboard');
  }
  res.render('login');
};

AuthController.login = async (req, res) => {
  const { email, password } = req.body;
  const validator = LoginValidator({ email, password });
  if (validator.error) {
    req.flash('error', validator.error);
    return res.redirect('/');
  }
  const user = await User.findOne({ email: validator.value.email });
  if (!user) {
    req.flash('error', "User doesn't exist with this email account.");
    return res.redirect('/');
  }
  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) {
    req.flash('error', 'Invalid Password!');
    return res.redirect('/');
  }

  req.session.user = { name: user.name, role: user.role };
  res.locals.user = req.session.user;
  await req.session.save();
  res.redirect('/dashboard');
};

AuthController.logout = (req, res) => {
  req.session.destroy(function () {
    res.redirect('/');
  });
};

module.exports = AuthController;
