/**
 * Trip Routes
 * Handle trip/package CRUD operations
 */

const express = require('express');
const router = express.Router();
const { tripController } = require('../controllers');
const { protect, adminOnly, tripValidation, validateObjectId, paginationValidation } = require('../middleware');

// Public routes
router.get('/search', paginationValidation, tripController.searchTrips);
router.get('/featured', tripController.getFeaturedTrips);
router.get('/upcoming', tripController.getUpcomingTrips);
router.get('/destination/:destinationId', validateObjectId('destinationId'), paginationValidation, tripController.getTripsByDestination);
router.get('/:id/availability', tripController.checkAvailability);
router.get('/', paginationValidation, tripController.getAllTrips);
router.get('/:id', tripController.getTrip);

// Admin routes
router.post('/', protect, adminOnly, tripValidation, tripController.createTrip);
router.put('/:id', protect, adminOnly, validateObjectId('id'), tripController.updateTrip);
router.delete('/:id', protect, adminOnly, validateObjectId('id'), tripController.deleteTrip);

module.exports = router;
