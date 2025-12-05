/**
 * Destination Routes
 * Handle destination CRUD operations
 */

const express = require('express');
const router = express.Router();
const { destinationController } = require('../controllers');
const { protect, adminOnly, optionalAuth: _optionalAuth, destinationValidation, validateObjectId, paginationValidation } = require('../middleware');

// Public routes
router.get('/search', paginationValidation, destinationController.searchDestinations);
router.get('/featured', destinationController.getFeaturedDestinations);
router.get('/popular', destinationController.getPopularDestinations);
router.get('/countries', destinationController.getCountries);
router.get('/', paginationValidation, destinationController.getAllDestinations);
router.get('/:id', destinationController.getDestination);

// Admin routes
router.post('/', protect, adminOnly, destinationValidation, destinationController.createDestination);
router.put('/:id', protect, adminOnly, validateObjectId('id'), destinationController.updateDestination);
router.delete('/:id', protect, adminOnly, validateObjectId('id'), destinationController.deleteDestination);

module.exports = router;
