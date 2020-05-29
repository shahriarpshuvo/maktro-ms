const EntryController = require('../controllers/EntryController');
const router = require('express').Router();
router.get('/', EntryController.read);

// router.get('/:id', InventoryController.getInventory);
// router.post('/', InventoryController.create);
// router.patch('/:id', InventoryController.updateInventory);
// router.delete('/:id', InventoryController.deleteInventory);

module.exports = router;
