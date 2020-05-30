const router = require('express').Router();
const InventoryController = require('../controllers/InventoryController');

router.get('/', InventoryController.read);

module.exports = router;
