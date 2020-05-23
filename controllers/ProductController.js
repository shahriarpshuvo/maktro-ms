const Product = require('../models/Product');
const {ProductValidator} = require('../middlewares/Validator');
const ProductController = {};

ProductController.getProducts = (req, res) => {
    res.render('products');
};

ProductController.create = async (req, res) => {
    const { name, code, rate } = req.body();
    const validator = ProductValidator({ name, code, rate });
    if (validator.error){
        req.session.alert = {error: validator.error};
        return res.redirect('/products');
    };

}



module.exports = ProductController;