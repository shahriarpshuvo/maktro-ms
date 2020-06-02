const router = require('express').Router();
const SaleController = require('../controllers/SaleController');
//const PdfController = require('../controllers/PdfController');
router.post('/', SaleController.create);
router.get('/:page', SaleController.read);
router.get('/', SaleController.read);
router.patch('/:id', SaleController.update);
router.delete('/:id', SaleController.delete);

const generateInvoice = require('../middlewares/InvoiceGenerator');
const fs = require('fs');

router.get('/invoice/:id', generateInvoice, (req, res) => {
    res.redirect(`/sales/print/${req.params.id}`);
});

router.get('/print/:id', (req, res) => {
    var data = fs.readFileSync(`./${req.params.id}.pdf`);
    res.contentType("application/pdf");
    res.send(data);
})

module.exports = router;
