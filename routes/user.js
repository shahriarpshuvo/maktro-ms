const UserController = require('../controllers/UserController');
const router = require('express').Router();

router.post('/', UserController.create);
router.get('/', UserController.read);
router.patch('/:id', UserController.update);
router.delete('/:id', UserController.delete);

router.post('/login', UserController.login);

module.exports = router;
