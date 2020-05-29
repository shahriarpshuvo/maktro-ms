const ProductController = require('../../controllers/ProductController');
const router = require('express').Router();

router.get('/', ProductController.getProducts);
router.get('/:id', ProductController.getProduct);

module.exports = router;
