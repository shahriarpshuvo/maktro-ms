const router = require('express').Router();
const ProductController = require('../controllers/ProductController');

router.post('/', ProductController.create);
router.get('/:page', ProductController.read);
router.get('/', ProductController.read);
router.patch('/:id', ProductController.update);
router.delete('/:id', ProductController.delete);

module.exports = router;
