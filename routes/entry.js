const EntryController = require('../controllers/EntryController');
const router = require('express').Router();

router.get('/', EntryController.read);
router.post('/', EntryController.create);
router.patch('/:id', EntryController.update);
router.delete('/:id', EntryController.delete);

module.exports = router;
