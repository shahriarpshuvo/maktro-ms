const router = require('express').Router();
const CustomerController = require('../controllers/CustomerController');

router.post('/', CustomerController.create);
router.get('/:page', CustomerController.read);
router.get('/', CustomerController.read);
router.patch('/payment', CustomerController.updateBalance);
router.patch('/:id', CustomerController.update);
router.delete('/:id', CustomerController.delete);

module.exports = router;
