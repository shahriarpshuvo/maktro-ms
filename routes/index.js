const router = require('express').Router();

const authRouter = require('./auth');
const apiRouter = require('./api/index');
const userRouter = require('./user');
const productRouter = require('./product');
const inventoryRouter = require('./inventory');
const entryRouter = require('./entry');
const servicingRouter = require('./servicing');
const expenseRouter = require('./expense');
const customerRouter = require('./customer');
const saleRouter = require('./sale');
const returnRouter = require('./return');
const dashboardRouter = require('./dashboard');

const AuthHandler = require('../middlewares/AuthHandler');
const PermissionHandler = require('../middlewares/PermissionHandler');

router.use('/', authRouter);
router.use(AuthHandler);
router.use('/api', apiRouter);
router.use('/dashboard', dashboardRouter);
router.use('/users', PermissionHandler(['admin']), userRouter);
router.use('/products', PermissionHandler(['admin']), productRouter);
router.use(
  '/inventories',
  PermissionHandler(['admin', 'inventory']),
  inventoryRouter
);
router.use('/entries', PermissionHandler(['admin', 'inventory']), entryRouter);
router.use(
  '/servicing',
  PermissionHandler(['admin', 'servicing']),
  servicingRouter
);
router.use('/expenses', PermissionHandler(['admin', 'expense']), expenseRouter);
router.use('/customers', PermissionHandler(['admin', 'sales']), customerRouter);
router.use('/sales', PermissionHandler(['admin', 'sales']), saleRouter);
router.use('/returns', PermissionHandler(['admin', 'sales']), returnRouter);

module.exports = router;
