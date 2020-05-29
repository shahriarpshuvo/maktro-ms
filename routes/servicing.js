const ServicingController = require('../controllers/ServicingController');
const router = require('express').Router();

router.post('/', ServicingController.create);
router.get('/', ServicingController.read);
router.patch('/:id', ServicingController.update);
router.delete('/:id', ServicingController.delete);

module.exports = router;
