/**
 * Stripe Payment Service
 * Handle all Stripe payment operations
 */

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { BadRequestError } = require('./errors');

/**
 * Create Checkout Session
 * @param {Object} booking - Booking object
 * @param {Object} trip - Trip object
 * @param {Object} user - User object
 * @returns {Object} Stripe checkout session
 */
const createCheckoutSession = async (booking, trip, user) => {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      customer_email: user.email,
      client_reference_id: booking._id.toString(),
      metadata: {
        bookingId: booking._id.toString(),
        confirmationCode: booking.confirmationCode,
        userId: user._id.toString(),
        tripId: trip._id.toString(),
      },
      line_items: [
        {
          price_data: {
            currency: booking.pricing.currency.toLowerCase(),
            product_data: {
              name: trip.name,
              description: `${trip.duration.days} Days / ${trip.duration.nights} Nights - ${booking.numberOfTravelers} Traveler(s)`,
              images: trip.primaryImage ? [trip.primaryImage] : [],
            },
            unit_amount: Math.round(booking.pricing.totalPrice * 100), // Stripe uses cents
          },
          quantity: 1,
        },
      ],
      success_url: `${process.env.FRONTEND_URL}/booking/success?session_id={CHECKOUT_SESSION_ID}&confirmation=${booking.confirmationCode}`,
      cancel_url: `${process.env.FRONTEND_URL}/booking/cancel?confirmation=${booking.confirmationCode}`,
      expires_at: Math.floor(Date.now() / 1000) + (30 * 60), // Session expires in 30 minutes
    });

    return session;
  } catch (error) {
    console.error('Stripe checkout session error:', error);
    throw new BadRequestError(`Payment session creation failed: ${error.message}`);
  }
};

/**
 * Create Payment Intent (Alternative to Checkout Session)
 * @param {number} amount - Amount in smallest currency unit (cents)
 * @param {string} currency - Currency code
 * @param {Object} metadata - Additional metadata
 * @returns {Object} Stripe payment intent
 */
const createPaymentIntent = async (amount, currency = 'usd', metadata = {}) => {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency: currency.toLowerCase(),
      metadata,
      automatic_payment_methods: {
        enabled: true,
      },
    });

    return paymentIntent;
  } catch (error) {
    console.error('Stripe payment intent error:', error);
    throw new BadRequestError(`Payment intent creation failed: ${error.message}`);
  }
};

/**
 * Retrieve Payment Intent
 * @param {string} paymentIntentId - Stripe payment intent ID
 * @returns {Object} Payment intent details
 */
const retrievePaymentIntent = async (paymentIntentId) => {
  try {
    return await stripe.paymentIntents.retrieve(paymentIntentId);
  } catch (error) {
    console.error('Stripe retrieve payment intent error:', error);
    throw new BadRequestError(`Failed to retrieve payment: ${error.message}`);
  }
};

/**
 * Retrieve Checkout Session
 * @param {string} sessionId - Stripe checkout session ID
 * @returns {Object} Session details
 */
const retrieveCheckoutSession = async (sessionId) => {
  try {
    return await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['payment_intent', 'line_items'],
    });
  } catch (error) {
    console.error('Stripe retrieve session error:', error);
    throw new BadRequestError(`Failed to retrieve session: ${error.message}`);
  }
};

/**
 * Create Refund
 * @param {string} paymentIntentId - Stripe payment intent ID
 * @param {number} amount - Amount to refund (optional, full refund if not provided)
 * @param {string} reason - Reason for refund
 * @returns {Object} Refund object
 */
const createRefund = async (paymentIntentId, amount = null, reason = 'requested_by_customer') => {
  try {
    const refundData = {
      payment_intent: paymentIntentId,
      reason,
    };

    if (amount) {
      refundData.amount = Math.round(amount * 100);
    }

    const refund = await stripe.refunds.create(refundData);
    return refund;
  } catch (error) {
    console.error('Stripe refund error:', error);
    throw new BadRequestError(`Refund failed: ${error.message}`);
  }
};

/**
 * Create Customer
 * @param {Object} user - User object
 * @returns {Object} Stripe customer
 */
const createCustomer = async (user) => {
  try {
    const customer = await stripe.customers.create({
      email: user.email,
      name: user.fullName,
      phone: user.phone,
      metadata: {
        userId: user._id.toString(),
      },
    });

    return customer;
  } catch (error) {
    console.error('Stripe create customer error:', error);
    throw new BadRequestError(`Failed to create customer: ${error.message}`);
  }
};

/**
 * Construct Webhook Event
 * @param {Buffer} payload - Raw request body
 * @param {string} signature - Stripe signature header
 * @returns {Object} Stripe event
 */
const constructWebhookEvent = (payload, signature) => {
  try {
    return stripe.webhooks.constructEvent(
      payload,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (error) {
    console.error('Stripe webhook signature verification failed:', error);
    throw new BadRequestError(`Webhook signature verification failed: ${error.message}`);
  }
};

/**
 * Calculate Refund Amount Based on Cancellation Policy
 * @param {Object} booking - Booking object
 * @param {Object} trip - Trip object
 * @returns {number} Refund amount
 */
const calculateRefundAmount = (booking, trip) => {
  const now = new Date();
  const departureDate = new Date(booking.selectedDate.departureDate);
  const daysUntilDeparture = Math.ceil((departureDate - now) / (1000 * 60 * 60 * 24));
  const totalAmount = booking.pricing.totalPrice;

  // Refund policy based on days until departure
  switch (trip.cancellationPolicy) {
    case 'flexible':
      // Full refund up to 24 hours before
      if (daysUntilDeparture >= 1) return totalAmount;
      return 0;

    case 'moderate':
      // Full refund 7+ days, 50% refund 3-7 days, no refund < 3 days
      if (daysUntilDeparture >= 7) return totalAmount;
      if (daysUntilDeparture >= 3) return totalAmount * 0.5;
      return 0;

    case 'strict':
      // Full refund 14+ days, 50% refund 7-14 days, no refund < 7 days
      if (daysUntilDeparture >= 14) return totalAmount;
      if (daysUntilDeparture >= 7) return totalAmount * 0.5;
      return 0;

    case 'non-refundable':
      return 0;

    default:
      // Default to moderate policy
      if (daysUntilDeparture >= 7) return totalAmount;
      if (daysUntilDeparture >= 3) return totalAmount * 0.5;
      return 0;
  }
};

module.exports = {
  createCheckoutSession,
  createPaymentIntent,
  retrievePaymentIntent,
  retrieveCheckoutSession,
  createRefund,
  createCustomer,
  constructWebhookEvent,
  calculateRefundAmount,
};
