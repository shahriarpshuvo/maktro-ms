const express = require("express");
const UserController = require('../controllers/UserController');
const router = express.Router();

router.get('/', UserController.getUsers);
router.get('/:id', UserController.getUser);
router.delete('/:id', UserController.deleteUser);
router.post('/login', UserController.login);
router.post('/', UserController.create);
router.patch('/:id', UserController.updateUser);


module.exports = router;