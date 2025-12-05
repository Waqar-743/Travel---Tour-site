/**
 * Controllers Index
 * Export all controllers from a single file
 */

const authController = require('./authController');
const userController = require('./userController');
const destinationController = require('./destinationController');
const tripController = require('./tripController');
const bookingController = require('./bookingController');
const reviewController = require('./reviewController');
const paymentController = require('./paymentController');

module.exports = {
  authController,
  userController,
  destinationController,
  tripController,
  bookingController,
  reviewController,
  paymentController,
};
