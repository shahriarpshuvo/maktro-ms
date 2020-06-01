const Inventory = require('../models/Inventory');
const Product = require('../models/Product');
const Entry = require('../models/Entry');

const InventoryController = {};

InventoryController.read = async (req, res) => {
    const getProducts = await Product.find({});
    let totalQuantity = {};

    let getData = getProducts.map( async (product) => {
        const productId = product.id;
        const inventoryProduct = await Entry.find({product:productId, type: 'inventory'});
        const inventoryQuantity = inventoryProduct.reduce((acc, curr) => acc + curr.quantity, 0);
        const salesProduct = await Entry.find({product:productId, type: 'sale'});
        const salesQuantity = salesProduct.reduce((acc, curr) => acc + curr.quantity, 0);
        const returnProduct = await Entry.find({product:productId, type: 'return'});
        const returnQuantity = returnProduct.reduce((acc, curr) => acc + curr.quantity, 0);
        totalQuantity[productId] = { inventoryQuantity, salesQuantity, returnQuantity }
        return totalQuantity;
    })
    const [data] = await Promise.all(getData)
    for(const id in data){

        let leftOver = (data[id].inventoryQuantity + data[id].returnQuantity) - data[id].salesQuantity;
        console.log(data[id].inventoryQuantity, data[id].returnQuantity, data[id].salesQuantity);
        console.log(leftOver);
        await Inventory.findOneAndUpdate({product:id}, {$set: {quantity: data[id].inventoryQuantity, leftOver:leftOver,  returns: data[id].returnQuantity, sales:  data[id].salesQuantity}});

    }

    const inventories = await Inventory.find({}).populate('product');
    res.render('inventories/index', { inventories });
};

module.exports = InventoryController;
