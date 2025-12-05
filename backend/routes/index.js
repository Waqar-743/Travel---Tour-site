/**
 * Routes Index
 * Export all routes from a single file
 */

const authRoutes = require('./authRoutes');
const userRoutes = require('./userRoutes');
const destinationRoutes = require('./destinationRoutes');
const tripRoutes = require('./tripRoutes');
const bookingRoutes = require('./bookingRoutes');
const reviewRoutes = require('./reviewRoutes');
const paymentRoutes = require('./paymentRoutes');
const inquiryRoutes = require('./inquiryRoutes');

module.exports = {
  authRoutes,
  userRoutes,
  destinationRoutes,
  tripRoutes,
  bookingRoutes,
  reviewRoutes,
  paymentRoutes,
  inquiryRoutes,
};
