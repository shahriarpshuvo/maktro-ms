const productRouter = require('./product');
const userRouter = require('./user');
const entryRouter = require('./entry');
const router = require('express').Router();

router.use('/products', productRouter);
router.use('/users', userRouter);
router.use('/entries', entryRouter);

module.exports = router;