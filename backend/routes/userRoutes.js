/**
 * User Routes
 * Handle user profile and account management
 */

const express = require('express');
const router = express.Router();
const { userController } = require('../controllers');
const { protect, adminOnly, updateProfileValidation, validateObjectId, paginationValidation } = require('../middleware');

// Protected routes
router.get('/profile', protect, userController.getProfile);
router.put('/profile', protect, updateProfileValidation, userController.updateProfile);
router.delete('/profile', protect, userController.deleteAccount);
router.get('/bookings', protect, paginationValidation, userController.getUserBookings);

// Favorites
router.post('/favorites/:destinationId', protect, validateObjectId('destinationId'), userController.addToFavorites);
router.delete('/favorites/:destinationId', protect, validateObjectId('destinationId'), userController.removeFromFavorites);

// Admin routes
router.get('/', protect, adminOnly, paginationValidation, userController.getAllUsers);
router.get('/:id', protect, adminOnly, validateObjectId('id'), userController.getUserById);
router.put('/:id/role', protect, adminOnly, validateObjectId('id'), userController.updateUserRole);

module.exports = router;
