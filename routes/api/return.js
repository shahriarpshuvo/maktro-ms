const router = require('express').Router();
const ReturnController = require('../../controllers/ReturnController');

router.get('/:id', ReturnController.getReturn);

module.exports = router;
