const express = require('express');

// eslint-disable-next-line import/no-dynamic-require
const userControllers = require(`${__dirname}/../controllers/userControllers`);
const authControllers = require('../controllers/authControllers');

const router = express.Router();

router.post('/signup', authControllers.signup);
router.post('/login', authControllers.login);
router.post('/forgot-password', authControllers.forgotPassword);
router.patch('/reset-password/:token', authControllers.resetPassword);
router.get(
  '/me',
  authControllers.protect,
  userControllers.getMe,
  userControllers.getUser
);

router.use(authControllers.protect);
router.patch('/updateMyPassword', authControllers.updatePassword);
router.patch('/updateMe', userControllers.updateme);
router.delete('/deleteMe', userControllers.deleteMe);

router.use(authControllers.restrictTo('admin'));

router
  .route('/')
  .get(userControllers.getAllUsers)
  .post(userControllers.createUser);
router
  .route('/:id')
  .get(userControllers.getUser)
  .patch(userControllers.updateUser)
  .delete(userControllers.deleteUser);

module.exports = router;
