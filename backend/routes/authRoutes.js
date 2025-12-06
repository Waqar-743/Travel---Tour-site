/**
 * Auth Routes
 * Handle authentication: register, login, logout, refresh token
 */

const express = require('express');
const router = express.Router();
const { authController } = require('../controllers');
const { protect, registerValidation, loginValidation } = require('../middleware');

// Public routes
router.post('/register', registerValidation, authController.register);
router.post('/verify-email', authController.verifyEmail);
router.post('/resend-verification', authController.resendVerification);
router.post('/login', loginValidation, authController.login);
router.post('/refresh-token', authController.refreshToken);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);

// Protected routes
router.post('/logout', protect, authController.logout);
router.get('/me', protect, authController.getMe);
router.put('/change-password', protect, authController.changePassword);

module.exports = router;
