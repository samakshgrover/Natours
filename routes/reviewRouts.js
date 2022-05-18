const express = require('express');

const reviewControllers = require('../controllers/reviewControllers');
const authControllers = require('../controllers/authControllers');

const router = express.Router({ mergeParams: true });

router.use(authControllers.protect);

router
  .route('/')
  .get(reviewControllers.getAllReviews)
  .post(
    authControllers.restrictTo('user'),
    reviewControllers.setTourUserId,
    reviewControllers.createReview
  );

router
  .route('/:id')
  .get(reviewControllers.getReview)
  .delete(
    authControllers.restrictTo('user', 'admin'),
    reviewControllers.deleteReview
  )
  .patch(
    authControllers.restrictTo('user', 'admin'),
    reviewControllers.updateReview
  );

module.exports = router;
