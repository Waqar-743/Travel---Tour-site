/**
 * Middleware Index
 * Export all middleware from a single file
 */

const { protect, optionalAuth, restrictTo, adminOnly, ownerOrAdmin } = require('./auth');
const { errorHandler, catchAsync, notFound } = require('./errorHandler');
const {
  handleValidation,
  registerValidation,
  loginValidation,
  updateProfileValidation,
  destinationValidation,
  tripValidation,
  bookingValidation,
  reviewValidation,
  validateObjectId,
  paginationValidation,
} = require('./validation');

module.exports = {
  // Auth middleware
  protect,
  optionalAuth,
  restrictTo,
  adminOnly,
  ownerOrAdmin,
  
  // Error handling
  errorHandler,
  catchAsync,
  notFound,
  
  // Validation
  handleValidation,
  registerValidation,
  loginValidation,
  updateProfileValidation,
  destinationValidation,
  tripValidation,
  bookingValidation,
  reviewValidation,
  validateObjectId,
  paginationValidation,
};
