const router = require('express').Router();
const SaleController = require('../controllers/SaleController');
const PdfController = require('../controllers/PdfController');

router.post('/', SaleController.create);
router.get('/:page', SaleController.read);
router.get('/', SaleController.read);
router.patch('/:id', SaleController.update);
router.delete('/:id', SaleController.delete);

const generateInvoice = require('../middlewares/InvoiceGenerator');

router.get('/invoice/:id', generateInvoice, PdfController.sales);

module.exports = router;
