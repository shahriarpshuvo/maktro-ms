const router = require('express').Router();
const DashboardController = require('../controllers/DashboardController');

router.get('/', DashboardController.read);

module.exports = router;
