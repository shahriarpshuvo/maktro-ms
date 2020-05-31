const router = require('express').Router();
const CustomerController = require('../../controllers/CustomerController');

router.get('/', CustomerController.getCustomers);
router.get('/:id', CustomerController.getCustomer);

module.exports = router;
