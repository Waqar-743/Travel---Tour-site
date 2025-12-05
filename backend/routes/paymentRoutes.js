/**
 * Payment Routes
 * Handle Stripe payments, webhooks, and payment history
 */

const express = require('express');
const router = express.Router();
const { paymentController } = require('../controllers');
const { protect, adminOnly, validateObjectId, paginationValidation } = require('../middleware');

// Webhook route (must be before json body parser, handled separately in server.js)
// router.post('/webhook', paymentController.handleWebhook);

// Admin routes
router.get('/admin/all', protect, adminOnly, paginationValidation, paymentController.getAllPayments);
router.get('/admin/stats', protect, adminOnly, paymentController.getPaymentStats);

// Protected routes
router.post('/create-checkout', protect, paymentController.createCheckout);
router.get('/verify/:sessionId', protect, paymentController.verifyPayment);
router.get('/history', protect, paginationValidation, paymentController.getPaymentHistory);
router.get('/:id', protect, validateObjectId('id'), paymentController.getPayment);

module.exports = router;
