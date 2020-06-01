const router = require('express').Router();
const EntryController = require('../controllers/EntryController');

router.get('/:page', EntryController.read);
router.get('/', EntryController.read);
router.post('/', EntryController.create);
router.patch('/:id', EntryController.update);
router.delete('/:id', EntryController.delete);

module.exports = router;
