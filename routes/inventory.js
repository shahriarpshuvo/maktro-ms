const InventoryController = require('../controllers/InventoryController');
const router = require('express').Router();

router.get('/', InventoryController.read);
// router.get('/:id', InventoryController.getInventory);
// router.post('/', InventoryController.create);
// router.patch('/:id', InventoryController.updateInventory);
// router.delete('/:id', InventoryController.deleteInventory);

module.exports = router;
