const Inventory = require('../models/Inventory');
const Product = require('../models/Product');
const Entry = require('../models/Entry');

const InventoryController = {};

InventoryController.read = async (req, res) => {
  const getProducts = await Product.find({});
  let getData = getProducts.map(async (product) => {
    const productId = product.id;
    const inventoryProduct = await Entry.find({
      product: productId,
      type: 'inventory',
    });
    const inventoryQuantity = inventoryProduct.reduce(
      (acc, curr) => acc + curr.quantity,
      0
    );
    const salesProduct = await Entry.find({ product: productId, type: 'sale' });
    const salesQuantity = salesProduct.reduce(
      (acc, curr) => acc + curr.quantity,
      0
    );
    const returnProduct = await Entry.find({
      product: productId,
      type: 'return',
    });
    const returnQuantity = returnProduct.reduce(
      (acc, curr) => acc + curr.quantity,
      0
    );
    let totalQuantity = {};
    totalQuantity[productId] = {
      inventoryQuantity,
      salesQuantity,
      returnQuantity,
    };
    return totalQuantity;
  });
  const records = await Promise.all(getData);
  records.forEach(async (data) => {
    for (const id in data) {
      let leftOver =
        data[id].inventoryQuantity +
        data[id].returnQuantity -
        data[id].salesQuantity;
      const n = await Inventory.findOneAndUpdate(
        { product: id },
        {
          $set: {
            quantity: data[id].inventoryQuantity,
            leftOver: leftOver,
            returns: data[id].returnQuantity,
            sales: data[id].salesQuantity,
          },
        }
      );
    }
  });

  const perPage = 30;
  const page = req.params.page || 1;
  let inventories = Inventory.find({}).populate('product');
  let count = await Inventory.countDocuments();

  let lookUpProduct = {
    from: 'products',
    localField: 'product',
    foreignField: '_id',
    as: 'product',
  };
  let matchObj = {
    'product.code': { $regex: req.query.searchQuery, $options: 'i' },
  };
  let queryString = {},
    countDocs;
  if (req.query.searchQuery) {
    inventories = Inventory.aggregate()
      .lookup(lookUpProduct)
      .match(matchObj)
      .unwind({
        preserveNullAndEmptyArrays: true,
        path: '$product',
      });
    countDocs = Inventory.aggregate().lookup(lookUpProduct).match(matchObj);
    queryString.query = req.query.searchQuery;
  }
  if (countDocs) {
    countDocs = await countDocs.exec();
    count = countDocs.length;
  }

  inventories = await inventories
    .skip(perPage * page - perPage)
    .limit(perPage)
    .sort({ createdAt: -1 })
    .exec();
  res.render('inventories/index', {
    inventories,
    queryString,
    current: page,
    pages: Math.ceil(count / perPage),
  });
};

module.exports = InventoryController;
