/**
 * Review Routes
 * Handle review CRUD operations
 */

const express = require('express');
const router = express.Router();
const { reviewController } = require('../controllers');
const { protect, adminOnly, reviewValidation, validateObjectId, paginationValidation } = require('../middleware');

// Admin routes (must be before :id routes)
router.get('/admin/all', protect, adminOnly, paginationValidation, reviewController.getAllReviews);
router.put('/:id/moderate', protect, adminOnly, validateObjectId('id'), reviewController.moderateReview);

// Public routes
router.get('/trip/:tripId', validateObjectId('tripId'), paginationValidation, reviewController.getTripReviews);
router.get('/user/:userId', validateObjectId('userId'), paginationValidation, reviewController.getUserReviews);
router.get('/:id', validateObjectId('id'), reviewController.getReview);

// Protected routes
router.post('/', protect, reviewValidation, reviewController.createReview);
router.put('/:id', protect, validateObjectId('id'), reviewController.updateReview);
router.delete('/:id', protect, validateObjectId('id'), reviewController.deleteReview);
router.post('/:id/helpful', protect, validateObjectId('id'), reviewController.voteHelpful);

module.exports = router;
