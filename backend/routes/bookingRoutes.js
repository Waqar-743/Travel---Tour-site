/**
 * Booking Routes
 * Handle booking creation, management, and cancellation
 */

const express = require('express');
const router = express.Router();
const { bookingController } = require('../controllers');
const { protect, adminOnly, optionalAuth, bookingValidation, validateObjectId, paginationValidation } = require('../middleware');

// Admin routes (must be before :id routes)
router.get('/admin/all', protect, adminOnly, paginationValidation, bookingController.getAllBookings);
router.get('/admin/stats', protect, adminOnly, bookingController.getBookingStats);

// Protected routes
router.post('/', protect, bookingValidation, bookingController.createBooking);
router.get('/', protect, paginationValidation, bookingController.getMyBookings);
router.get('/confirmation/:code', optionalAuth, bookingController.getBookingByCode);
router.get('/:id', protect, validateObjectId('id'), bookingController.getBooking);
router.put('/:id/cancel', protect, validateObjectId('id'), bookingController.cancelBooking);

// Admin route
router.put('/:id/status', protect, adminOnly, validateObjectId('id'), bookingController.updateBookingStatus);

module.exports = router;
