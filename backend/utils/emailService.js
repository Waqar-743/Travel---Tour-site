/**
 * Email Service
 * Handle all email operations using Nodemailer
 */

const nodemailer = require('nodemailer');

// Create reusable transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE,
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT || 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
};

/**
 * Send Email
 * @param {Object} options - Email options
 */
const sendEmail = async (options) => {
  const transporter = createTransporter();

  const mailOptions = {
    from: process.env.EMAIL_FROM || `"GB Travel Agency" <${process.env.EMAIL_USER}>`,
    to: options.to,
    subject: options.subject,
    text: options.text,
    html: options.html,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.messageId);
    return info;
  } catch (error) {
    console.error('Email sending failed:', error);
    throw error;
  }
};

/**
 * Email Templates
 */

// Welcome Email
const sendWelcomeEmail = async (user) => {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🌍 Welcome to GB Travel Agency!</h1>
        </div>
        <div class="content">
          <h2>Hello ${user.fullName}! 👋</h2>
          <p>Thank you for joining our travel community! We're thrilled to have you on board.</p>
          <p>With GB Travel Agency, you can:</p>
          <ul>
            <li>🗺️ Explore amazing destinations around the world</li>
            <li>📦 Book curated travel packages</li>
            <li>💬 Get personalized travel recommendations</li>
            <li>🎫 Enjoy exclusive member discounts</li>
          </ul>
          <p>Ready to start your adventure?</p>
          <a href="${process.env.FRONTEND_URL}" class="button">Explore Destinations</a>
          <p>If you have any questions, feel free to reach out to our support team.</p>
          <p>Happy travels! ✈️</p>
          <p>- The GB Travel Agency Team</p>
        </div>
        <div class="footer">
          <p>© ${new Date().getFullYear()} GB Travel Agency. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return sendEmail({
    to: user.email,
    subject: '🌍 Welcome to GB Travel Agency!',
    text: `Hello ${user.fullName}! Welcome to GB Travel Agency. We're thrilled to have you on board.`,
    html,
  });
};

// Email Verification Email
const sendEmailVerificationEmail = async (user, verificationToken) => {
  const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}&email=${encodeURIComponent(user.email)}`;
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #1a3a3a 0%, #2d5a5a 100%); color: white; padding: 40px 30px; text-align: center; border-radius: 12px 12px 0 0; }
        .header h1 { margin: 0; font-size: 28px; }
        .content { background: #ffffff; padding: 40px 30px; border: 1px solid #e5e7eb; border-top: none; }
        .verification-box { background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%); border: 2px dashed #d4a574; border-radius: 12px; padding: 30px; text-align: center; margin: 25px 0; }
        .button { display: inline-block; background: linear-gradient(135deg, #d4a574 0%, #c4915f 100%); color: #1a3a3a; padding: 16px 40px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; margin: 20px 0; }
        .button:hover { opacity: 0.9; }
        .expiry-notice { background: #fef3c7; border: 1px solid #f59e0b; border-radius: 8px; padding: 15px; margin: 20px 0; text-align: center; }
        .expiry-notice strong { color: #92400e; }
        .footer { background: #f9fafb; padding: 25px 30px; text-align: center; color: #6b7280; font-size: 13px; border-radius: 0 0 12px 12px; border: 1px solid #e5e7eb; border-top: none; }
        .footer a { color: #d4a574; text-decoration: none; }
        .icon { font-size: 48px; margin-bottom: 10px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="icon">✉️</div>
          <h1>Verify Your Email</h1>
        </div>
        <div class="content">
          <h2 style="color: #1a3a3a; margin-top: 0;">Hello ${user.fullName}! 👋</h2>
          <p>Thank you for signing up with <strong>GB Travel Agency</strong>! To complete your registration and start exploring amazing destinations, please verify your email address.</p>
          
          <div class="verification-box">
            <p style="margin: 0 0 10px 0; color: #6b7280; font-size: 14px;">Click the button below to verify your email:</p>
            <a href="${verificationUrl}" class="button">
              Verify Email Now
            </a>
            <p style="margin: 10px 0 0 0; color: #6b7280; font-size: 13px;">Or copy this link: <br><a href="${verificationUrl}" style="color: #2d5a5a; word-break: break-all;">${verificationUrl}</a></p>
          </div>
          
          <div class="expiry-notice">
            <strong>⏰ This link expires in 24 hours</strong>
            <p style="margin: 5px 0 0 0; font-size: 13px;">If you don't verify within this time, you'll need to request a new link.</p>
          </div>
          
          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
          
          <p style="color: #6b7280; font-size: 13px;">
            <strong>Didn't sign up for GB Travel Agency?</strong><br>
            If you didn't create an account, you can safely ignore this email. Someone may have entered your email by mistake.
          </p>
        </div>
        <div class="footer">
          <p style="margin: 0 0 10px 0;">
            <strong>GB Travel Agency</strong> - Explore Gilgit Baltistan
          </p>
          <p style="margin: 0;">
            <a href="${process.env.FRONTEND_URL}">Visit Website</a> • 
            <a href="${process.env.FRONTEND_URL}/contact">Contact Support</a>
          </p>
          <p style="margin: 15px 0 0 0; font-size: 11px;">
            © ${new Date().getFullYear()} GB Travel Agency. All rights reserved.
          </p>
        </div>
      </div>
    </body>
    </html>
  `;

  return sendEmail({
    to: user.email,
    subject: '✉️ Verify Your Email - GB Travel Agency',
    text: `Hello ${user.fullName}! Please verify your email by clicking this link: ${verificationUrl}. This link expires in 24 hours.`,
    html,
  });
};

// Login Notification Email
const sendLoginNotificationEmail = async (user, loginInfo = {}) => {
  const loginTime = new Date().toLocaleString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZoneName: 'short'
  });

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .login-info { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #667eea; }
        .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .warning { background: #fef3c7; border: 1px solid #f59e0b; padding: 15px; border-radius: 8px; margin: 20px 0; }
        .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🔐 New Login Detected</h1>
        </div>
        <div class="content">
          <h2>Hello ${user.fullName}!</h2>
          <p>We noticed a new login to your GB Travel Agency account.</p>
          
          <div class="login-info">
            <h3>📍 Login Details</h3>
            <p><strong>Time:</strong> ${loginTime}</p>
            <p><strong>Device:</strong> ${loginInfo.userAgent || 'Unknown device'}</p>
            <p><strong>IP Address:</strong> ${loginInfo.ipAddress || 'Unknown'}</p>
          </div>
          
          <p>If this was you, no action is needed. You can continue exploring amazing destinations!</p>
          
          <div class="warning">
            <strong>⚠️ Wasn't you?</strong>
            <p>If you didn't log in, please change your password immediately and contact our support team.</p>
          </div>
          
          <a href="${process.env.FRONTEND_URL}" class="button">Visit Your Account</a>
          
          <p>Stay safe and happy travels! ✈️</p>
          <p>- The GB Travel Agency Team</p>
        </div>
        <div class="footer">
          <p>© ${new Date().getFullYear()} GB Travel Agency. All rights reserved.</p>
          <p>This is an automated security notification.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return sendEmail({
    to: user.email,
    subject: '🔐 New Login to Your GB Travel Agency Account',
    text: `Hello ${user.fullName}! A new login was detected on your account at ${loginTime}.`,
    html,
  });
};

// Booking Confirmation Email
const sendBookingConfirmationEmail = async (booking, user, trip) => {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .booking-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .detail-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee; }
        .confirmation-code { font-size: 24px; font-weight: bold; color: #11998e; text-align: center; padding: 20px; background: #e8f5e9; border-radius: 8px; margin: 20px 0; }
        .button { display: inline-block; background: #11998e; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>✅ Booking Confirmed!</h1>
        </div>
        <div class="content">
          <h2>Thank you, ${user.fullName}!</h2>
          <p>Your booking has been confirmed. Here are your trip details:</p>
          
          <div class="confirmation-code">
            Confirmation Code: ${booking.confirmationCode}
          </div>
          
          <div class="booking-details">
            <h3>📦 Trip Details</h3>
            <div class="detail-row">
              <span>Trip:</span>
              <strong>${trip.name}</strong>
            </div>
            <div class="detail-row">
              <span>Departure:</span>
              <strong>${new Date(booking.selectedDate.departureDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</strong>
            </div>
            <div class="detail-row">
              <span>Return:</span>
              <strong>${new Date(booking.selectedDate.returnDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</strong>
            </div>
            <div class="detail-row">
              <span>Travelers:</span>
              <strong>${booking.numberOfTravelers}</strong>
            </div>
            <div class="detail-row">
              <span>Total Price:</span>
              <strong>${booking.pricing.currency} ${booking.pricing.totalPrice.toLocaleString()}</strong>
            </div>
          </div>
          
          <p>📧 A detailed itinerary will be sent to you 7 days before your trip.</p>
          <p>📱 Save your confirmation code for easy reference.</p>
          
          <a href="${process.env.FRONTEND_URL}/bookings/${booking.confirmationCode}" class="button">View Booking Details</a>
          
          <p>If you have any questions, please don't hesitate to contact us.</p>
          <p>Have a wonderful trip! 🌟</p>
          <p>- The GB Travel Agency Team</p>
        </div>
        <div class="footer">
          <p>© ${new Date().getFullYear()} GB Travel Agency. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return sendEmail({
    to: user.email,
    subject: `✅ Booking Confirmed - ${booking.confirmationCode}`,
    text: `Your booking has been confirmed! Confirmation Code: ${booking.confirmationCode}. Trip: ${trip.name}. Departure: ${new Date(booking.selectedDate.departureDate).toLocaleDateString()}`,
    html,
  });
};

// Payment Receipt Email
const sendPaymentReceiptEmail = async (payment, user, booking) => {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .receipt { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border: 1px solid #ddd; }
        .amount { font-size: 32px; font-weight: bold; color: #667eea; text-align: center; padding: 20px; }
        .detail-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee; }
        .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>💳 Payment Receipt</h1>
        </div>
        <div class="content">
          <h2>Hello ${user.fullName},</h2>
          <p>Thank you for your payment. Here's your receipt:</p>
          
          <div class="receipt">
            <div class="amount">
              ${payment.currency} ${payment.amount.toLocaleString()}
            </div>
            <div class="detail-row">
              <span>Transaction ID:</span>
              <strong>${payment.stripePaymentIntentId || payment._id}</strong>
            </div>
            <div class="detail-row">
              <span>Booking Reference:</span>
              <strong>${booking.confirmationCode}</strong>
            </div>
            <div class="detail-row">
              <span>Payment Date:</span>
              <strong>${new Date(payment.processedAt || payment.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</strong>
            </div>
            <div class="detail-row">
              <span>Payment Method:</span>
              <strong>${payment.cardDetails ? `${payment.cardDetails.brand?.toUpperCase()} ****${payment.cardDetails.last4}` : 'Card'}</strong>
            </div>
            <div class="detail-row">
              <span>Status:</span>
              <strong style="color: #11998e;">✓ Paid</strong>
            </div>
          </div>
          
          <p>This receipt confirms your payment has been processed successfully.</p>
          <p>Please keep this email for your records.</p>
          
          <p>Best regards,<br>- The GB Travel Agency Team</p>
        </div>
        <div class="footer">
          <p>© ${new Date().getFullYear()} GB Travel Agency. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return sendEmail({
    to: user.email,
    subject: `💳 Payment Receipt - ${payment.currency} ${payment.amount.toLocaleString()}`,
    text: `Payment received: ${payment.currency} ${payment.amount}. Transaction ID: ${payment.stripePaymentIntentId || payment._id}`,
    html,
  });
};

// Booking Cancellation Email
const sendBookingCancellationEmail = async (booking, user, trip, refundAmount = 0) => {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .cancellation-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .detail-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee; }
        .refund-info { background: #fff3cd; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ffc107; }
        .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>❌ Booking Cancelled</h1>
        </div>
        <div class="content">
          <h2>Hello ${user.fullName},</h2>
          <p>Your booking has been cancelled as requested. Here are the details:</p>
          
          <div class="cancellation-details">
            <div class="detail-row">
              <span>Confirmation Code:</span>
              <strong>${booking.confirmationCode}</strong>
            </div>
            <div class="detail-row">
              <span>Trip:</span>
              <strong>${trip.name}</strong>
            </div>
            <div class="detail-row">
              <span>Original Departure:</span>
              <strong>${new Date(booking.selectedDate.departureDate).toLocaleDateString()}</strong>
            </div>
            <div class="detail-row">
              <span>Cancellation Date:</span>
              <strong>${new Date().toLocaleDateString()}</strong>
            </div>
          </div>
          
          ${refundAmount > 0 ? `
          <div class="refund-info">
            <strong>💰 Refund Information</strong>
            <p>A refund of <strong>${booking.pricing.currency} ${refundAmount.toLocaleString()}</strong> will be processed within 5-10 business days.</p>
          </div>
          ` : ''}
          
          <p>We're sorry to see you go. If you'd like to book another trip in the future, we'd love to have you back!</p>
          
          <p>If you have any questions about your cancellation or refund, please contact our support team.</p>
          
          <p>Best regards,<br>- The GB Travel Agency Team</p>
        </div>
        <div class="footer">
          <p>© ${new Date().getFullYear()} GB Travel Agency. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return sendEmail({
    to: user.email,
    subject: `❌ Booking Cancelled - ${booking.confirmationCode}`,
    text: `Your booking ${booking.confirmationCode} for ${trip.name} has been cancelled.`,
    html,
  });
};

// Trip Reminder Email (7 days before)
const sendTripReminderEmail = async (booking, user, trip) => {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .countdown { font-size: 48px; font-weight: bold; color: #f5576c; text-align: center; padding: 20px; }
        .checklist { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .checklist li { padding: 8px 0; }
        .button { display: inline-block; background: #f5576c; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🎒 Your Trip is Coming Up!</h1>
        </div>
        <div class="content">
          <h2>Hello ${user.fullName}!</h2>
          
          <div class="countdown">
            7 Days to Go! ⏰
          </div>
          
          <p>Your adventure to <strong>${trip.name}</strong> is just around the corner!</p>
          
          <div class="checklist">
            <h3>✅ Pre-Trip Checklist:</h3>
            <ul>
              <li>📄 Verify your passport is valid (6+ months from travel date)</li>
              <li>🏥 Check visa requirements and vaccinations</li>
              <li>🧳 Start packing - check the weather at your destination</li>
              <li>📱 Download offline maps and useful apps</li>
              <li>💳 Notify your bank about international travel</li>
              <li>📋 Print or save your booking confirmation</li>
              <li>🔌 Pack adapters for your destination</li>
            </ul>
          </div>
          
          <p><strong>Departure Date:</strong> ${new Date(booking.selectedDate.departureDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
          
          <a href="${process.env.FRONTEND_URL}/bookings/${booking.confirmationCode}" class="button">View Your Itinerary</a>
          
          <p>Get excited - an amazing adventure awaits! 🌟</p>
          <p>- The GB Travel Agency Team</p>
        </div>
        <div class="footer">
          <p>© ${new Date().getFullYear()} GB Travel Agency. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return sendEmail({
    to: user.email,
    subject: `🎒 7 Days Until Your Trip - ${trip.name}!`,
    text: `Your trip to ${trip.name} is coming up in 7 days! Departure: ${new Date(booking.selectedDate.departureDate).toLocaleDateString()}`,
    html,
  });
};

// Password Reset Email
const sendPasswordResetEmail = async (user, resetToken) => {
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .warning { background: #fff3cd; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ffc107; }
        .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🔐 Password Reset Request</h1>
        </div>
        <div class="content">
          <h2>Hello ${user.fullName},</h2>
          <p>We received a request to reset your password. Click the button below to create a new password:</p>
          
          <a href="${resetUrl}" class="button">Reset Password</a>
          
          <div class="warning">
            <strong>⚠️ This link expires in 1 hour.</strong>
            <p>If you didn't request a password reset, please ignore this email or contact support if you're concerned about your account security.</p>
          </div>
          
          <p>If the button doesn't work, copy and paste this link into your browser:</p>
          <p style="word-break: break-all; color: #667eea;">${resetUrl}</p>
          
          <p>Best regards,<br>- The GB Travel Agency Team</p>
        </div>
        <div class="footer">
          <p>© ${new Date().getFullYear()} GB Travel Agency. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return sendEmail({
    to: user.email,
    subject: '🔐 Password Reset Request - GB Travel Agency',
    text: `Reset your password by clicking this link: ${resetUrl}. This link expires in 1 hour.`,
    html,
  });
};

module.exports = {
  sendEmail,
  sendWelcomeEmail,
  sendEmailVerificationEmail,
  sendLoginNotificationEmail,
  sendBookingConfirmationEmail,
  sendPaymentReceiptEmail,
  sendBookingCancellationEmail,
  sendTripReminderEmail,
  sendPasswordResetEmail,
};
