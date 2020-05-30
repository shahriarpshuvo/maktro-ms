const router = require('express').Router();
const ExpenseController = require('../../controllers/ExpenseController');

router.get('/:id', ExpenseController.getExpense);

module.exports = router;
