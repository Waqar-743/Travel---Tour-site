/**
 * Auth Controller
 * Handle authentication operations: register, login, logout, refresh token
 */

const { User } = require('../models');
const { generateTokens, verifyRefreshToken } = require('../utils/jwtHelper');
const { successResponse, createdResponse, errorResponse } = require('../utils/responseFormatter');
const { sendWelcomeEmail, sendLoginNotificationEmail, sendPasswordResetEmail, sendEmailSafe } = require('../utils/emailService');
const { catchAsync } = require('../middleware/errorHandler');

/**
 * Register new user
 * POST /api/auth/register
 * No email verification - instant signup with welcome email
 */
const register = catchAsync(async (req, res) => {
  const { fullName, email, password, phone } = req.body;

  // Check if user already exists
  const existingUser = await User.findOne({ email: email.toLowerCase() });
  if (existingUser) {
    return errorResponse(res, 'Email already registered', 409);
  }

  // Create user - mark as verified immediately (no verification needed)
  const user = await User.create({
    fullName,
    email: email.toLowerCase(),
    password,
    phone,
    isEmailVerified: true, // Auto-verify
  });

  // Generate tokens for immediate login
  const tokens = generateTokens(user);
  user.refreshTokens.push(tokens.refreshToken);
  user.lastLogin = new Date();
  await user.save({ validateBeforeSave: false });

  // Send welcome email (fire and forget with retry logic)
  sendEmailSafe({
    to: user.email,
    subject: '🌍 Welcome to GB Travel Agency!',
    text: `Hello ${user.fullName}! Welcome to GB Travel Agency. Start exploring amazing destinations today!`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 0 auto; }
          .header { background: linear-gradient(135deg, #1a3a3a 0%, #2d5a5a 100%); color: white; padding: 40px 30px; text-align: center; border-radius: 12px 12px 0 0; }
          .content { background: #ffffff; padding: 40px 30px; border: 1px solid #e5e7eb; }
          .button { display: inline-block; background: linear-gradient(135deg, #d4a574 0%, #c4915f 100%); color: #1a3a3a; padding: 14px 35px; text-decoration: none; border-radius: 8px; font-weight: 600; margin: 20px 0; }
          .features { background: #f8f9fa; padding: 25px; border-radius: 10px; margin: 20px 0; }
          .feature-item { padding: 8px 0; }
          .footer { background: #f9fafb; padding: 25px 30px; text-align: center; color: #6b7280; font-size: 13px; border-radius: 0 0 12px 12px; border: 1px solid #e5e7eb; border-top: none; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 style="margin: 0; font-size: 28px;">🌍 Welcome to GB Travel Agency!</h1>
          </div>
          <div class="content">
            <h2 style="color: #1a3a3a; margin-top: 0;">Hello ${user.fullName}! 👋</h2>
            <p>Thank you for joining our travel community! Your account is now active and ready to use.</p>
            
            <div class="features">
              <p style="margin: 0 0 15px 0; font-weight: 600; color: #1a3a3a;">With your new account, you can:</p>
              <div class="feature-item">🗺️ Explore beautiful destinations in Gilgit-Baltistan</div>
              <div class="feature-item">📦 Book curated travel packages</div>
              <div class="feature-item">💬 Get personalized travel recommendations</div>
              <div class="feature-item">🎫 Enjoy exclusive member discounts</div>
            </div>
            
            <a href="${process.env.FRONTEND_URL || 'https://waqar-743.github.io/Travel---Tour-site'}" class="button">
              Start Exploring →
            </a>
            
            <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
              If you have any questions, our team is here to help you plan your perfect adventure.
            </p>
          </div>
          <div class="footer">
            <p style="margin: 0;">© ${new Date().getFullYear()} GB Travel Agency. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `,
  }).then(result => {
    console.log('Welcome email result:', result);
  });

  return createdResponse(res, {
    user: user.toPublicJSON(),
    tokens,
  }, 'Registration successful! Welcome to GB Travel Agency.');
});

/**
 * Verify Email
 * POST /api/auth/verify-email
 */
const verifyEmail = catchAsync(async (req, res) => {
  const { email, token } = req.body;

  if (!email || !token) {
    return errorResponse(res, 'Email and verification token are required', 400);
  }

  // Find user with verification fields
  const user = await User.findOne({ email: email.toLowerCase() })
    .select('+emailVerificationToken +emailVerificationTokenExpires');

  if (!user) {
    return errorResponse(res, 'User not found', 404);
  }

  if (user.isEmailVerified) {
    return successResponse(res, { 
      alreadyVerified: true 
    }, 'Email is already verified');
  }

  // Verify the token
  const verification = user.verifyEmailToken(token);

  if (!verification.valid) {
    if (verification.reason === 'expired') {
      return errorResponse(res, 'Verification link has expired. Please request a new one.', 400);
    }
    if (verification.reason === 'invalid') {
      return errorResponse(res, 'Invalid verification link. Please try again.', 400);
    }
    return errorResponse(res, 'Verification failed. Please request a new link.', 400);
  }

  // Mark email as verified
  user.isEmailVerified = true;
  user.emailVerificationToken = undefined;
  user.emailVerificationTokenExpires = undefined;
  
  // Generate tokens for auto-login
  const tokens = generateTokens(user);
  user.refreshTokens.push(tokens.refreshToken);
  user.lastLogin = new Date();
  
  await user.save({ validateBeforeSave: false });

  // Send welcome email after verification
  sendWelcomeEmail(user).catch((err) => {
    console.error('Failed to send welcome email:', err);
  });

  return successResponse(res, {
    user: user.toPublicJSON(),
    tokens,
  }, 'Email verified successfully!');
});

/**
 * Resend Verification Email
 * POST /api/auth/resend-verification
 */
const resendVerification = catchAsync(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return errorResponse(res, 'Email is required', 400);
  }

  const user = await User.findOne({ email: email.toLowerCase() });

  if (!user) {
    return errorResponse(res, 'User not found', 404);
  }

  if (user.isEmailVerified) {
    return successResponse(res, { 
      alreadyVerified: true 
    }, 'Email is already verified');
  }

  // Generate new verification token
  const verificationToken = user.generateEmailVerificationToken();
  await user.save({ validateBeforeSave: false });

  // Send verification email
  sendEmailVerificationEmail(user, verificationToken).catch((err) => {
    console.error('Failed to send verification email:', err);
  });

  return successResponse(res, {
    email: user.email,
    message: 'Verification email sent successfully',
  }, 'Verification email resent. Please check your inbox.');
});

/**
 * Login user
 * POST /api/auth/login
 */
const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;

  // Find user with password
  const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
  
  if (!user) {
    return errorResponse(res, 'Invalid email or password', 401);
  }

  // Check if account is active
  if (!user.isActive) {
    return errorResponse(res, 'Account has been deactivated', 401);
  }

  // Check password
  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    return errorResponse(res, 'Invalid email or password', 401);
  }

  // Generate tokens
  const tokens = generateTokens(user);

  // Save refresh token and update last login
  user.refreshTokens.push(tokens.refreshToken);
  user.lastLogin = new Date();
  await user.save({ validateBeforeSave: false });

  // Send login notification email (fire and forget)
  const loginInfo = {
    userAgent: req.get('User-Agent') || 'Unknown',
    ipAddress: req.ip || req.connection.remoteAddress || 'Unknown',
  };
  sendLoginNotificationEmail(user, loginInfo).catch((err) => {
    console.error('Failed to send login notification email:', err);
  });

  return successResponse(res, {
    user: user.toPublicJSON(),
    tokens,
  }, 'Login successful');
});

/**
 * Logout user
 * POST /api/auth/logout
 */
const logout = catchAsync(async (req, res) => {
  const { refreshToken } = req.body;

  if (refreshToken && req.user) {
    // Remove refresh token from user
    req.user.refreshTokens = req.user.refreshTokens.filter(
      (token) => token !== refreshToken
    );
    await req.user.save({ validateBeforeSave: false });
  }

  return successResponse(res, null, 'Logout successful');
});

/**
 * Refresh access token
 * POST /api/auth/refresh-token
 */
const refreshToken = catchAsync(async (req, res) => {
  const { refreshToken: token } = req.body;

  if (!token) {
    return errorResponse(res, 'Refresh token is required', 400);
  }

  // Verify refresh token
  let decoded;
  try {
    decoded = verifyRefreshToken(token);
  } catch (error) {
    return errorResponse(res, error.message, 401);
  }

  // Find user
  const user = await User.findById(decoded.id);
  if (!user) {
    return errorResponse(res, 'User not found', 401);
  }

  // Check if refresh token exists in user's tokens
  if (!user.refreshTokens.includes(token)) {
    return errorResponse(res, 'Invalid refresh token', 401);
  }

  // Generate new tokens
  const tokens = generateTokens(user);

  // Remove old refresh token and add new one (token rotation)
  user.refreshTokens = user.refreshTokens.filter((t) => t !== token);
  user.refreshTokens.push(tokens.refreshToken);
  await user.save({ validateBeforeSave: false });

  return successResponse(res, { tokens }, 'Token refreshed successfully');
});

/**
 * Get current user
 * GET /api/auth/me
 */
const getMe = catchAsync(async (req, res) => {
  const user = await User.findById(req.user._id)
    .populate('preferences.favoriteDestinations', 'name slug primaryImage')
    .populate({
      path: 'bookingHistory',
      options: { limit: 5, sort: { createdAt: -1 } },
      populate: { path: 'trip', select: 'name slug primaryImage' },
    });

  return successResponse(res, { user: user.toPublicJSON() }, 'User retrieved successfully');
});

/**
 * Change password
 * PUT /api/auth/change-password
 */
const changePassword = catchAsync(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  // Get user with password
  const user = await User.findById(req.user._id).select('+password');

  // Check current password
  const isMatch = await user.comparePassword(currentPassword);
  if (!isMatch) {
    return errorResponse(res, 'Current password is incorrect', 401);
  }

  // Update password
  user.password = newPassword;
  // Clear all refresh tokens (force re-login on all devices)
  user.refreshTokens = [];
  await user.save();

  // Generate new tokens
  const tokens = generateTokens(user);
  user.refreshTokens.push(tokens.refreshToken);
  await user.save({ validateBeforeSave: false });

  return successResponse(res, { tokens }, 'Password changed successfully');
});

/**
 * Forgot Password
 * POST /api/auth/forgot-password
 */
const forgotPassword = catchAsync(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return errorResponse(res, 'Email is required', 400);
  }

  const user = await User.findOne({ email: email.toLowerCase() });

  if (!user) {
    // Don't reveal if user exists or not for security
    return successResponse(res, {}, 'If an account with that email exists, a password reset link has been sent.');
  }

  // Generate reset token
  const resetToken = user.generatePasswordResetToken();
  await user.save({ validateBeforeSave: false });

  // Send password reset email
  try {
    await sendPasswordResetEmail(user, resetToken);
    return successResponse(res, {}, 'Password reset link sent to your email.');
  } catch (error) {
    // If email fails, clear the token
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });
    console.error('Failed to send password reset email:', error);
    return errorResponse(res, 'Failed to send email. Please try again later.', 500);
  }
});

/**
 * Reset Password
 * POST /api/auth/reset-password
 */
const resetPassword = catchAsync(async (req, res) => {
  const { token, newPassword } = req.body;

  if (!token || !newPassword) {
    return errorResponse(res, 'Token and new password are required', 400);
  }

  if (newPassword.length < 6) {
    return errorResponse(res, 'Password must be at least 6 characters', 400);
  }

  // Hash the token to compare with stored hash
  const crypto = require('crypto');
  const hashedToken = crypto
    .createHash('sha256')
    .update(token)
    .digest('hex');

  // Find user with valid token
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) {
    return errorResponse(res, 'Invalid or expired reset token. Please request a new password reset.', 400);
  }

  // Update password
  user.password = newPassword;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  // Clear all refresh tokens (force re-login on all devices)
  user.refreshTokens = [];
  await user.save();

  // Generate new tokens for auto-login
  const tokens = generateTokens(user);
  user.refreshTokens.push(tokens.refreshToken);
  await user.save({ validateBeforeSave: false });

  return successResponse(res, { 
    user: user.toPublicJSON(),
    tokens 
  }, 'Password reset successful. You are now logged in.');
});

module.exports = {
  register,
  verifyEmail,
  resendVerification,
  login,
  logout,
  refreshToken,
  getMe,
  changePassword,
  forgotPassword,
  resetPassword,
};
