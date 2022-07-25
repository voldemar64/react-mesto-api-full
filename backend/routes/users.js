const router = require('express').Router();
const {
  getUsers,
  getCurrentUser,
  getUser,
  patchUser,
  patchAvatar,
} = require('../controllers/users');
const {
  currentUserValidation,
  userValidation,
  avatarValidation,
} = require('../middlewares/validation');

router.get('/', getUsers);
router.get('/me', getUser);
router.get('/:id', currentUserValidation, getCurrentUser);
router.patch('/me', userValidation, patchUser);
router.patch('/me/avatar', avatarValidation, patchAvatar);

module.exports = router;
