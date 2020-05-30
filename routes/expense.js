const ExpenseController = require('../controllers/ExpenseController');
const router = require('express').Router();

router.post('/', ExpenseController.create);
router.get('/', ExpenseController.read);
router.patch('/:id', ExpenseController.update);
router.delete('/:id', ExpenseController.delete);

module.exports = router;
