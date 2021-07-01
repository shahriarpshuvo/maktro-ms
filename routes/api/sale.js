const router = require('express').Router();
const SaleController = require('../../controllers/SaleController');

router.get('/:id', SaleController.getSale);

module.exports = router;
