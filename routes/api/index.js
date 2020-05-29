const productRouter = require('./product');
const userRouter = require('./user');
const router = require('express').Router();

router.use('/products', productRouter);
router.use('/users', userRouter);
module.exports = router;