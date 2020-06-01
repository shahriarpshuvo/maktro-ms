const router = require('express').Router();
const ReturnController = require('../controllers/ReturnController');

router.post('/', ReturnController.create);
router.get('/:page', ReturnController.read);
router.get('/', ReturnController.read);
router.patch('/:id', ReturnController.update);
router.delete('/:id', ReturnController.delete);

module.exports = router;
