const router = require('express').Router();
const InventoryController = require('../controllers/InventoryController');

router.get('/:page', InventoryController.read);
router.get('/', InventoryController.read);

module.exports = router;
