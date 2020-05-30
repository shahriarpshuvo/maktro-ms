const ExpenseController = require('../../controllers/ExpenseController');
const router = require('express').Router();

router.get('/:id', ExpenseController.getExpense);

module.exports = router;