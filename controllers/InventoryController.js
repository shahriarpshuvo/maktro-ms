const Inventory = require('../models/Inventory');
//const { InventoryValidator } = require('../middlewares/Validator');

const InventoryController = {};

InventoryController.read = async (req, res) => {
    const inventories = await Inventory.find({});
    res.render('inventories/index', { inventories });
};

/*
InventoryController.getInventory = async (req, res) => {
    try {
        const inventory = await Inventory.findById(req.params.id);
        if (inventory) return res.send(inventory);
        return res.send("Inventory Doesn't Exist");
    } catch (e) {
        // console.error(e);
        return '';
    }
};

InventoryController.create = async (req, res) => {
    const { name, code, rate } = req.body;
    const validator = InventoryValidator({ name, code, rate });
    if (validator.error) {
        req.flash('error', validator.error);
        return res.redirect('/Inventorys');
    }
    const existInventory = await Inventory.findOne({ code: validator.value.code });
    if (existInventory) {
        req.flash('error', `A Inventory with "${existInventory.code}" has already existed!`);
        return res.redirect('/Inventorys');
    }
    const Inventory = new Inventory({
        name: validator.value.name,
        code: validator.value.code,
        rate: validator.value.rate,
    });
    try {
        const savedInventory = await Inventory.save();
        req.flash('success', `Inventory (${savedInventory.name}) has been successfully added!`);
        return res.redirect('/Inventorys');
    } catch (e) {
        req.flash('error', `Error While Saving Data - ${e}`);
        return res.redirect('/Inventorys');
    }
};


InventoryController.updateInventory = async (req, res) => {
    const Inventory = await Inventory.findByIdAndUpdate(req.params.id,
        { $set: req.body },
        { new: true });
    req.flash('success', `Inventory (${Inventory.name}) has been updated successfully!`);
    res.redirect('/Inventorys');
};


InventoryController.deleteInventory = async (req, res) => {
    const Inventory = await Inventory.findByIdAndDelete(req.params.id);
    req.flash('success', `Inventory (${Inventory.name}) has been deleted successfully!`);
    res.redirect('/Inventorys');
};

*/
module.exports = InventoryController;
