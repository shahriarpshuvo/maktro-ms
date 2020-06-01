const router = require('express').Router();
const ExpenseController = require('../controllers/ExpenseController');

router.post('/', ExpenseController.create);
router.get('/:page', ExpenseController.read);
router.get('/', ExpenseController.read);
router.patch('/:id', ExpenseController.update);
router.delete('/:id', ExpenseController.delete);

module.exports = router;
