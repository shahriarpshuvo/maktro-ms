const router = require('express').Router();
const CustomerController = require('../../controllers/CustomerController');

router.get('/:id', CustomerController.getCustomer);

module.exports = router;
