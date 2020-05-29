const InventoryController = require('../controllers/InventoryController');
const router = require('express').Router();

router.get('/', InventoryController.read);

module.exports = router;
