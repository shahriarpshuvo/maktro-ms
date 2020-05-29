const ServicingController = require('../../controllers/ServicingController');
const router = require('express').Router();

router.get('/:id', ServicingController.getServicing);

module.exports = router;