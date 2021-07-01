module.exports = (role) => {
  return (req, res, next) => {
    if (req.session.user) {
      const currentUserRole = req.session.user.role;
      if (role.includes(currentUserRole)) {
        return next();
      }
    }
    res.render('permission');
  };
};
