/**
 * Payment Controller
 * Handle Stripe payments, webhooks, and payment history
 */

const { Payment, Booking } = require('../models');
const { successResponse, errorResponse, paginatedResponse } = require('../utils/responseFormatter');
const { catchAsync } = require('../middleware/errorHandler');
const {
  createCheckoutSession,
  retrieveCheckoutSession,
  constructWebhookEvent,
} = require('../utils/stripeService');
const {
  sendBookingConfirmationEmail,
  sendPaymentReceiptEmail,
} = require('../utils/emailService');

/**
 * Create Stripe checkout session
 * POST /api/payments/create-checkout
 */
const createCheckout = catchAsync(async (req, res) => {
  const { bookingId } = req.body;

  // Get booking
  const booking = await Booking.findById(bookingId).populate('trip');
  
  if (!booking) {
    return errorResponse(res, 'Booking not found', 404);
  }

  // Check ownership
  if (booking.user.toString() !== req.user._id.toString()) {
    return errorResponse(res, 'Not authorized', 403);
  }

  // Check if already paid
  if (booking.paymentStatus === 'completed') {
    return errorResponse(res, 'Booking is already paid', 400);
  }

  // Create Stripe checkout session
  const session = await createCheckoutSession(booking, booking.trip, req.user);

  // Update booking with session ID
  booking.stripeSessionId = session.id;
  booking.paymentStatus = 'processing';
  await booking.save();

  return successResponse(res, {
    sessionId: session.id,
    url: session.url,
  }, 'Checkout session created');
});

/**
 * Verify payment (after redirect from Stripe)
 * GET /api/payments/verify/:sessionId
 */
const verifyPayment = catchAsync(async (req, res) => {
  const { sessionId } = req.params;

  // Retrieve session from Stripe
  const session = await retrieveCheckoutSession(sessionId);

  if (session.payment_status !== 'paid') {
    return errorResponse(res, 'Payment not completed', 400);
  }

  // Find and update booking
  const booking = await Booking.findOne({ stripeSessionId: sessionId })
    .populate('trip')
    .populate('user', 'fullName email');

  if (!booking) {
    return errorResponse(res, 'Booking not found', 404);
  }

  // If already processed, just return success
  if (booking.paymentStatus === 'completed') {
    return successResponse(res, { booking }, 'Payment already verified');
  }

  // Update booking
  booking.paymentStatus = 'completed';
  booking.bookingStatus = 'confirmed';
  booking.stripePaymentIntentId = session.payment_intent;
  booking.remindersSent.confirmationEmail = true;
  await booking.save();

  // Create payment record
  const payment = await Payment.create({
    user: booking.user._id,
    booking: booking._id,
    amount: booking.pricing.totalPrice,
    currency: booking.pricing.currency,
    paymentMethod: 'card',
    stripeSessionId: session.id,
    stripePaymentIntentId: session.payment_intent,
    status: 'succeeded',
    processedAt: new Date(),
  });

  // Send confirmation emails
  Promise.all([
    sendBookingConfirmationEmail(booking, booking.user, booking.trip),
    sendPaymentReceiptEmail(payment, booking.user, booking),
  ]).catch((err) => {
    console.error('Failed to send emails:', err);
  });

  return successResponse(res, { booking, payment }, 'Payment verified successfully');
});

/**
 * Stripe webhook handler
 * POST /api/payments/webhook
 */
const handleWebhook = async (req, res) => {
  const signature = req.headers['stripe-signature'];

  let event;
  try {
    event = constructWebhookEvent(req.body, signature);
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object;
      
      try {
        const booking = await Booking.findOne({ stripeSessionId: session.id })
          .populate('trip')
          .populate('user', 'fullName email');

        if (booking && booking.paymentStatus !== 'completed') {
          // Update booking
          booking.paymentStatus = 'completed';
          booking.bookingStatus = 'confirmed';
          booking.stripePaymentIntentId = session.payment_intent;
          await booking.save();

          // Create payment record
          const payment = await Payment.create({
            user: booking.user._id,
            booking: booking._id,
            amount: booking.pricing.totalPrice,
            currency: booking.pricing.currency,
            paymentMethod: 'card',
            stripeSessionId: session.id,
            stripePaymentIntentId: session.payment_intent,
            status: 'succeeded',
            processedAt: new Date(),
          });

          // Send emails
          Promise.all([
            sendBookingConfirmationEmail(booking, booking.user, booking.trip),
            sendPaymentReceiptEmail(payment, booking.user, booking),
          ]).catch(console.error);
        }
      } catch (err) {
        console.error('Error processing checkout.session.completed:', err);
      }
      break;
    }

    case 'payment_intent.payment_failed': {
      const paymentIntent = event.data.object;
      
      try {
        const booking = await Booking.findOne({ stripePaymentIntentId: paymentIntent.id });
        
        if (booking) {
          booking.paymentStatus = 'failed';
          await booking.save();

          // Record failed payment
          await Payment.create({
            user: booking.user,
            booking: booking._id,
            amount: booking.pricing.totalPrice,
            currency: booking.pricing.currency,
            stripePaymentIntentId: paymentIntent.id,
            status: 'failed',
            failureReason: paymentIntent.last_payment_error?.message,
            failureCode: paymentIntent.last_payment_error?.code,
          });
        }
      } catch (err) {
        console.error('Error processing payment_intent.payment_failed:', err);
      }
      break;
    }

    case 'charge.refunded': {
      const charge = event.data.object;
      
      try {
        const payment = await Payment.findOne({ stripePaymentIntentId: charge.payment_intent });
        
        if (payment) {
          payment.status = charge.refunded ? 'refunded' : 'partially_refunded';
          await payment.save();
        }
      } catch (err) {
        console.error('Error processing charge.refunded:', err);
      }
      break;
    }

    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  res.json({ received: true });
};

/**
 * Get payment history
 * GET /api/payments/history
 */
const getPaymentHistory = catchAsync(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const [payments, total] = await Promise.all([
    Payment.find({ user: req.user._id, type: 'payment' })
      .populate('booking', 'confirmationCode')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Payment.countDocuments({ user: req.user._id, type: 'payment' }),
  ]);

  return paginatedResponse(res, payments, {
    page,
    limit,
    totalItems: total,
    totalPages: Math.ceil(total / limit),
  }, 'Payment history retrieved');
});

/**
 * Get single payment
 * GET /api/payments/:id
 */
const getPayment = catchAsync(async (req, res) => {
  const payment = await Payment.findById(req.params.id)
    .populate('booking', 'confirmationCode trip')
    .populate({
      path: 'booking',
      populate: { path: 'trip', select: 'name slug' },
    });

  if (!payment) {
    return errorResponse(res, 'Payment not found', 404);
  }

  // Check ownership
  if (payment.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    return errorResponse(res, 'Not authorized', 403);
  }

  return successResponse(res, { payment }, 'Payment retrieved');
});

/**
 * Get all payments (Admin only)
 * GET /api/payments/admin/all
 */
const getAllPayments = catchAsync(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const skip = (page - 1) * limit;

  const query = {};
  if (req.query.status) {
    query.status = req.query.status;
  }
  if (req.query.type) {
    query.type = req.query.type;
  }

  const [payments, total] = await Promise.all([
    Payment.find(query)
      .populate('user', 'fullName email')
      .populate('booking', 'confirmationCode')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Payment.countDocuments(query),
  ]);

  return paginatedResponse(res, payments, {
    page,
    limit,
    totalItems: total,
    totalPages: Math.ceil(total / limit),
  }, 'Payments retrieved');
});

/**
 * Get payment statistics (Admin only)
 * GET /api/payments/admin/stats
 */
const getPaymentStats = catchAsync(async (req, res) => {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfYear = new Date(now.getFullYear(), 0, 1);

  const [
    totalRevenue,
    monthlyRevenue,
    yearlyRevenue,
    revenueByMonth,
  ] = await Promise.all([
    Payment.aggregate([
      { $match: { status: 'succeeded', type: 'payment' } },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]),
    Payment.aggregate([
      { 
        $match: { 
          status: 'succeeded', 
          type: 'payment',
          processedAt: { $gte: startOfMonth },
        },
      },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]),
    Payment.aggregate([
      { 
        $match: { 
          status: 'succeeded', 
          type: 'payment',
          processedAt: { $gte: startOfYear },
        },
      },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]),
    Payment.aggregate([
      { 
        $match: { 
          status: 'succeeded', 
          type: 'payment',
          processedAt: { $gte: startOfYear },
        },
      },
      {
        $group: {
          _id: { $month: '$processedAt' },
          total: { $sum: '$amount' },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]),
  ]);

  return successResponse(res, {
    totalRevenue: totalRevenue[0]?.total || 0,
    monthlyRevenue: monthlyRevenue[0]?.total || 0,
    yearlyRevenue: yearlyRevenue[0]?.total || 0,
    revenueByMonth: revenueByMonth.map((m) => ({
      month: m._id,
      revenue: m.total,
      transactions: m.count,
    })),
  }, 'Payment statistics retrieved');
});

module.exports = {
  createCheckout,
  verifyPayment,
  handleWebhook,
  getPaymentHistory,
  getPayment,
  getAllPayments,
  getPaymentStats,
};
