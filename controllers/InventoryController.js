const Inventory = require('../models/Inventory');

const InventoryController = {};

InventoryController.read = async (req, res) => {
    const inventories = await Inventory.find({}).populate('product');
    res.render('inventories/index', { inventories });
};

module.exports = InventoryController;
