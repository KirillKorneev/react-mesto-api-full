const router = require('express').Router();
const {
  getUsers, getUser, updateUser, newUser, updateAvatar,
} = require('../controllers/users.js');

router.get('/users', getUsers);

router.get('/users/:id', getUser);

router.post('/users', newUser);

router.patch('/users/me', updateUser);

router.patch('/users/me/avatar', updateAvatar);

module.exports = router;
