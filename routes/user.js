const router = require('express').Router();
const UserController = require('../controllers/UserController');

router.post('/', UserController.create);
router.get('/', UserController.read);
router.patch('/:id', UserController.update);
router.delete('/:id', UserController.delete);

router.post('/login', UserController.login);

module.exports = router;
