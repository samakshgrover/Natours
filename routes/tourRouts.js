const express = require('express');

const router = express.Router();

const tourControllers = require(`../controllers/tourControllers`);
const authControllers = require('../controllers/authControllers');
const reviewRouter = require('./reviewRouts');

router.use('/:tourId/reviews', reviewRouter);
router
  .route('/top-5-tours')
  .get(tourControllers.aliasTopTours, tourControllers.getTours);
router
  .route('/monthly-plan/:year')
  .get(
    authControllers.protect,
    authControllers.restrictTo('admin', 'lead-guide', 'guide'),
    tourControllers.getMonthlyPlane
  );
router.route('/tour-stats').get(tourControllers.getTourStats);

router
  .route('/')
  .get(tourControllers.getTours)
  .post(
    authControllers.protect,
    authControllers.restrictTo('admin', 'lead-guide'),
    tourControllers.createTour
  );
router
  .route('/:id')
  .get(tourControllers.getTour)
  .delete(
    authControllers.protect,
    authControllers.restrictTo('admin', 'lead-guide'),
    tourControllers.deleteTour
  )
  .patch(
    authControllers.protect,
    authControllers.restrictTo('admin', 'lead-guide'),
    tourControllers.updateTour
  );

router
  .route('/tour-within/:distance/center/:latlng/unit/:unit')
  .get(tourControllers.getToursWithin);
router.route('/distances/:latlng/unit/:unit').get(tourControllers.getDistances);
module.exports = router;

// router
//   .route('/:tourId/reviews')
//   .post(
//     authControllers.protect,
//     authControllers.restrictTo('user'),
//     reviewController.createReview
//   );
