/**
 * Payment Model
 * Tracks all payment transactions for bookings
 */

const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User is required'],
    },
    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Booking',
      required: [true, 'Booking is required'],
    },
    amount: {
      type: Number,
      required: [true, 'Amount is required'],
      min: [0, 'Amount cannot be negative'],
    },
    currency: {
      type: String,
      default: 'USD',
      uppercase: true,
    },
    paymentMethod: {
      type: String,
      enum: ['card', 'bank_transfer', 'paypal', 'cash', 'other'],
      default: 'card',
    },
    cardDetails: {
      brand: { type: String }, // e.g., 'visa', 'mastercard'
      last4: { type: String },
      expiryMonth: { type: Number },
      expiryYear: { type: Number },
    },
    stripePaymentIntentId: {
      type: String,
    },
    stripeChargeId: {
      type: String,
    },
    stripeSessionId: {
      type: String,
    },
    stripeCustomerId: {
      type: String,
    },
    status: {
      type: String,
      enum: ['pending', 'processing', 'succeeded', 'failed', 'cancelled', 'refunded', 'partially_refunded'],
      default: 'pending',
    },
    type: {
      type: String,
      enum: ['payment', 'refund', 'partial_refund'],
      default: 'payment',
    },
    refundDetails: {
      originalPaymentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Payment' },
      refundAmount: { type: Number },
      refundReason: { type: String },
      refundedAt: { type: Date },
      stripeRefundId: { type: String },
    },
    description: {
      type: String,
    },
    metadata: {
      type: Map,
      of: String, // Store any additional metadata from Stripe
    },
    receiptUrl: {
      type: String,
    },
    invoiceId: {
      type: String,
    },
    failureReason: {
      type: String,
    },
    failureCode: {
      type: String,
    },
    processedAt: {
      type: Date,
    },
    billingDetails: {
      name: { type: String },
      email: { type: String },
      phone: { type: String },
      address: {
        line1: { type: String },
        line2: { type: String },
        city: { type: String },
        state: { type: String },
        postalCode: { type: String },
        country: { type: String },
      },
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes
paymentSchema.index({ user: 1 });
paymentSchema.index({ booking: 1 });
paymentSchema.index({ stripePaymentIntentId: 1 });
paymentSchema.index({ stripeSessionId: 1 });
paymentSchema.index({ status: 1 });
paymentSchema.index({ createdAt: -1 });

// Pre-save middleware to set processedAt for successful payments
paymentSchema.pre('save', function (next) {
  if (this.isModified('status') && this.status === 'succeeded' && !this.processedAt) {
    this.processedAt = new Date();
  }
  next();
});

// Static method to get payment summary for a user
paymentSchema.statics.getUserPaymentSummary = async function (userId) {
  return this.aggregate([
    { $match: { user: userId, status: 'succeeded', type: 'payment' } },
    {
      $group: {
        _id: '$currency',
        totalAmount: { $sum: '$amount' },
        paymentCount: { $sum: 1 },
      },
    },
  ]);
};

// Static method to get revenue for a date range
paymentSchema.statics.getRevenue = async function (startDate, endDate) {
  return this.aggregate([
    {
      $match: {
        status: 'succeeded',
        type: 'payment',
        processedAt: { $gte: startDate, $lte: endDate },
      },
    },
    {
      $group: {
        _id: {
          currency: '$currency',
          date: { $dateToString: { format: '%Y-%m-%d', date: '$processedAt' } },
        },
        totalAmount: { $sum: '$amount' },
        count: { $sum: 1 },
      },
    },
    { $sort: { '_id.date': 1 } },
  ]);
};

const Payment = mongoose.model('Payment', paymentSchema);

module.exports = Payment;
