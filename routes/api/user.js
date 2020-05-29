const UserController = require('../../controllers/UserController');
const router = require('express').Router();

router.get('/:id', UserController.getUser);

module.exports = router;