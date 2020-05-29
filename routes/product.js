const ProductController = require('../controllers/ProductController');
const router = require('express').Router();

router.post('/', ProductController.create);
router.get('/', ProductController.read);
router.patch('/:id', ProductController.update);
router.delete('/:id', ProductController.delete);

module.exports = router;
