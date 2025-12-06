/**
 * Auth Routes
 * Handle authentication: register, login, logout, refresh token
 */

const express = require('express');
const router = express.Router();
const { authController } = require('../controllers');
const { protect, registerValidation, loginValidation } = require('../middleware');
const { verifyEmailConfig, sendEmail } = require('../utils/emailService');

// Email test endpoint (for debugging)
router.get('/test-email-config', async (req, res) => {
  const result = await verifyEmailConfig();
  res.json({
    ...result,
    config: {
      EMAIL_USER: process.env.EMAIL_USER ? 'SET' : 'NOT SET',
      EMAIL_PASSWORD: process.env.EMAIL_PASSWORD ? 'SET' : 'NOT SET',
      EMAIL_HOST: process.env.EMAIL_HOST || 'smtp.gmail.com (default)',
      EMAIL_PORT: process.env.EMAIL_PORT || '465 (default)',
      FRONTEND_URL: process.env.FRONTEND_URL || 'NOT SET',
    }
  });
});

// Send test email endpoint
router.post('/send-test-email', async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ success: false, message: 'Email is required' });
  }
  
  try {
    await sendEmail({
      to: email,
      subject: '🧪 Test Email from GB Travel Agency',
      text: 'This is a test email to verify the email configuration is working.',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 500px; margin: 0 auto;">
          <h2 style="color: #2d7a7e;">✅ Email Configuration Working!</h2>
          <p>This is a test email from GB Travel Agency to confirm that the email service is properly configured.</p>
          <p><strong>Timestamp:</strong> ${new Date().toISOString()}</p>
          <hr>
          <p style="color: #666; font-size: 12px;">GB Travel Agency</p>
        </div>
      `,
    });
    res.json({ success: true, message: 'Test email sent successfully!' });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Failed to send test email',
      error: error.message,
    });
  }
});

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
