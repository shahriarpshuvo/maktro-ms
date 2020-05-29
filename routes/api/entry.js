const EntryController = require('../../controllers/EntryController');
const router = require('express').Router();

router.get('/:id', EntryController.getEntry);

module.exports = router;