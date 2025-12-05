/**
 * Booking Model
 * Handles trip bookings with traveler details, payment status, and confirmations
 */

const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const travelerSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  dateOfBirth: { type: Date },
  age: { type: Number },
  gender: { type: String, enum: ['male', 'female', 'other', 'prefer-not-to-say'] },
  passportNumber: { type: String },
  passportExpiry: { type: Date },
  nationality: { type: String },
  dietaryRequirements: { type: String },
  medicalConditions: { type: String },
  emergencyContact: {
    name: { type: String },
    phone: { type: String },
    relationship: { type: String },
  },
});

const bookingSchema = new mongoose.Schema(
  {
    confirmationCode: {
      type: String,
      unique: true,
      uppercase: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User is required'],
    },
    trip: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Trip',
      required: [true, 'Trip is required'],
    },
    selectedDate: {
      departureDate: { type: Date, required: true },
      returnDate: { type: Date, required: true },
    },
    numberOfTravelers: {
      type: Number,
      required: [true, 'Number of travelers is required'],
      min: [1, 'At least 1 traveler is required'],
    },
    travelers: [travelerSchema],
    pricing: {
      pricePerPerson: { type: Number, required: true },
      subtotal: { type: Number, required: true },
      taxes: { type: Number, default: 0 },
      fees: { type: Number, default: 0 },
      discount: { type: Number, default: 0 },
      discountCode: { type: String },
      totalPrice: { type: Number, required: true },
      currency: { type: String, default: 'USD' },
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'processing', 'completed', 'failed', 'refunded', 'partially-refunded'],
      default: 'pending',
    },
    paymentMethod: {
      type: String,
      enum: ['stripe', 'paypal', 'bank-transfer', 'cash'],
      default: 'stripe',
    },
    stripePaymentIntentId: {
      type: String,
    },
    stripeSessionId: {
      type: String,
    },
    bookingStatus: {
      type: String,
      enum: ['pending', 'confirmed', 'cancelled', 'completed', 'no-show'],
      default: 'pending',
    },
    specialRequests: {
      type: String,
      maxlength: [1000, 'Special requests cannot exceed 1000 characters'],
    },
    internalNotes: {
      type: String, // Admin-only notes
    },
    cancellation: {
      isCancelled: { type: Boolean, default: false },
      cancelledAt: { type: Date },
      cancelledBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      reason: { type: String },
      refundAmount: { type: Number },
      refundStatus: { type: String, enum: ['pending', 'processing', 'completed', 'denied'] },
    },
    contactInfo: {
      email: { type: String, required: true },
      phone: { type: String },
      preferredContactMethod: { type: String, enum: ['email', 'phone', 'both'], default: 'email' },
    },
    billingAddress: {
      street: { type: String },
      city: { type: String },
      state: { type: String },
      country: { type: String },
      postalCode: { type: String },
    },
    addOns: [
      {
        name: { type: String },
        price: { type: Number },
        quantity: { type: Number, default: 1 },
      },
    ],
    documents: [
      {
        name: { type: String },
        url: { type: String },
        type: { type: String }, // e.g., 'invoice', 'itinerary', 'voucher'
        uploadedAt: { type: Date, default: Date.now },
      },
    ],
    remindersSent: {
      confirmationEmail: { type: Boolean, default: false },
      paymentReminder: { type: Boolean, default: false },
      tripReminder7Days: { type: Boolean, default: false },
      tripReminder1Day: { type: Boolean, default: false },
    },
    source: {
      type: String,
      enum: ['website', 'mobile-app', 'phone', 'walk-in', 'agent'],
      default: 'website',
    },
    agentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // If booked through an agent
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes (confirmationCode index is already created by unique: true)
bookingSchema.index({ user: 1 });
bookingSchema.index({ trip: 1 });
bookingSchema.index({ bookingStatus: 1 });
bookingSchema.index({ paymentStatus: 1 });
bookingSchema.index({ 'selectedDate.departureDate': 1 });
bookingSchema.index({ createdAt: -1 });

// Generate confirmation code before saving
bookingSchema.pre('save', function (next) {
  if (!this.confirmationCode) {
    // Generate a unique confirmation code (e.g., GB-ABC12345)
    const prefix = 'GB';
    const uniquePart = uuidv4().replace(/-/g, '').substring(0, 8).toUpperCase();
    this.confirmationCode = `${prefix}-${uniquePart}`;
  }
  
  // Calculate total price
  if (this.pricing) {
    this.pricing.subtotal = this.pricing.pricePerPerson * this.numberOfTravelers;
    this.pricing.totalPrice = 
      this.pricing.subtotal + 
      (this.pricing.taxes || 0) + 
      (this.pricing.fees || 0) - 
      (this.pricing.discount || 0);
    
    // Add add-ons to total
    if (this.addOns && this.addOns.length > 0) {
      const addOnsTotal = this.addOns.reduce((sum, addOn) => {
        return sum + (addOn.price * (addOn.quantity || 1));
      }, 0);
      this.pricing.totalPrice += addOnsTotal;
    }
  }
  
  next();
});

// Virtual for days until trip
bookingSchema.virtual('daysUntilTrip').get(function () {
  if (!this.selectedDate || !this.selectedDate.departureDate) return null;
  const now = new Date();
  const departure = new Date(this.selectedDate.departureDate);
  const diffTime = departure - now;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
});

// Virtual for trip duration
bookingSchema.virtual('tripDuration').get(function () {
  if (!this.selectedDate) return null;
  const departure = new Date(this.selectedDate.departureDate);
  const returnDate = new Date(this.selectedDate.returnDate);
  const diffTime = returnDate - departure;
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
});

// Method to check if booking can be cancelled
bookingSchema.methods.canBeCancelled = function () {
  if (this.cancellation.isCancelled) return false;
  if (this.bookingStatus === 'completed') return false;
  if (this.bookingStatus === 'cancelled') return false;
  
  // Check if trip has already started
  if (this.selectedDate && this.selectedDate.departureDate) {
    const now = new Date();
    if (new Date(this.selectedDate.departureDate) <= now) return false;
  }
  
  return true;
};

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;
