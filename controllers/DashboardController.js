const DashboardController = {};

DashboardController.read = async (req, res) => {
    res.render('dashboard/index');
};

module.exports = DashboardController;
