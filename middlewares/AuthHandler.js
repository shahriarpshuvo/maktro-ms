module.exports = (req, res, next) => {
  if (req.session.user) {
    res.locals.user = req.session.user;
    return next();
  }
  req.flash('error', 'You must be logged in first!');
  res.redirect('/');
};
