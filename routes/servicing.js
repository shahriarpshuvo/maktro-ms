const router = require('express').Router();
const ServicingController = require('../controllers/ServicingController');

router.post('/', ServicingController.create);
router.get('/:page', ServicingController.read);
router.get('/', ServicingController.read);
router.patch('/:id', ServicingController.update);
router.delete('/:id', ServicingController.delete);

const generatePdf = require('../middlewares/ServicingGenerator');
const fs = require('fs');

router.get('/invoice/:id', generatePdf, (req, res) => {
  res.redirect(`/servicing/print/${req.params.id}`);
});

router.get('/print/:id', (req, res) => {
  const data = fs.readFileSync(`./files/servicing/${req.params.id}.pdf`);
  res.contentType('application/pdf');
  res.send(data);
});

module.exports = router;
