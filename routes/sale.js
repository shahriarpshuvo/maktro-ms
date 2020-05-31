const router = require('express').Router();
const SaleController = require('../controllers/SaleController');

router.post('/', SaleController.create);
router.get('/', SaleController.read);
router.patch('/:id', SaleController.update);
router.delete('/:id', SaleController.delete);

module.exports = router;