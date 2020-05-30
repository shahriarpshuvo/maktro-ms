const productRouter = require('./product');
const userRouter = require('./user');
const entryRouter = require('./entry');
const servicingRouter = require('./servicing');
const expenseRouter = require('./expense');
const router = require('express').Router();

router.use('/products', productRouter);
router.use('/users', userRouter);
router.use('/entries', entryRouter);
router.use('/servicing', servicingRouter);
router.use('/expenses', expenseRouter);

module.exports = router;