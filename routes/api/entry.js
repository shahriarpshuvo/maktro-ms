const router = require('express').Router();
const EntryController = require('../../controllers/EntryController');

router.get('/:id', EntryController.getEntry);

module.exports = router;
