const router = require('express').Router();
const ServicingController = require('../../controllers/ServicingController');

router.get('/:id', ServicingController.getServicing);

module.exports = router;
