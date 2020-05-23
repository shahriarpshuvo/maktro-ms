const express = require("express");
const ProductController = require('../controllers/ProductController');
const router = express.Router();

router.get('/', ProductController.getProducts);
router.get('/:id', ProductController.getProduct);
router.post('/', ProductController.create);
router.patch('/:id', ProductController.updateProduct);
router.delete('/:id', ProductController.deleteProduct);


module.exports = router;