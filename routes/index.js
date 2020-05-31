const router = require('express').Router();

const apiRouter = require('./api/index');
const userRouter = require('./user');
const productRouter = require('./product');
const inventoryRouter = require('./inventory');
const entryRouter = require('./entry');
const servicingRouter = require('./servicing');
const expenseRouter = require('./expense');
const customerRouter = require('./customer');
const saleRouter = require('./sale');


router.get('/', (req, res) => { res.render('login'); });
router.use('/api', apiRouter);
router.use('/users', userRouter);
router.use('/products', productRouter);
router.use('/inventories', inventoryRouter);
router.use('/entries', entryRouter);
router.use('/servicing', servicingRouter);
router.use('/expenses', expenseRouter);
router.use('/customers', customerRouter);
router.use('/sales', saleRouter);

module.exports = router;
