/**
 * Booking Controller
 * Handle booking creation, management, and cancellation
 */

const mongoose = require('mongoose');
const { Booking, Trip, User, Payment } = require('../models');
const { successResponse, createdResponse, errorResponse, paginatedResponse } = require('../utils/responseFormatter');
const { catchAsync } = require('../middleware/errorHandler');
const { 
  createCheckoutSession, 
  calculateRefundAmount, 
  createRefund 
} = require('../utils/stripeService');
const { 
  sendBookingConfirmationEmail, 
  sendBookingCancellationEmail 
} = require('../utils/emailService');

/**
 * Create new booking
 * POST /api/bookings
 */
const createBooking = catchAsync(async (req, res) => {
  const {
    trip: tripId,
    selectedDate,
    numberOfTravelers,
    travelers,
    contactInfo,
    specialRequests,
    billingAddress,
    addOns,
  } = req.body;

  // Get trip details
  let trip;
  if (mongoose.Types.ObjectId.isValid(tripId)) {
    trip = await Trip.findById(tripId);
  } else {
    // Try finding by packageId (integer)
    trip = await Trip.findOne({ packageId: tripId });
  }

  if (!trip) {
    return errorResponse(res, 'Trip not found', 404);
  }

  if (trip.status !== 'active') {
    return errorResponse(res, 'This trip is not available for booking', 400);
  }

  // Check availability
  const spotsRemaining = trip.maxCapacity - trip.currentBookings;
  if (numberOfTravelers > spotsRemaining) {
    return errorResponse(res, `Only ${spotsRemaining} spots available`, 400);
  }

  // Validate selected date
  const selectedDateObj = trip.availableDates.find(
    (d) => new Date(d.departureDate).getTime() === new Date(selectedDate.departureDate).getTime()
  );

  if (!selectedDateObj) {
    return errorResponse(res, 'Selected date is not available', 400);
  }

  if (selectedDateObj.spotsAvailable < numberOfTravelers) {
    return errorResponse(res, `Only ${selectedDateObj.spotsAvailable} spots available for this date`, 400);
  }

  // Calculate pricing
  const pricePerPerson = trip.price.amount + (selectedDateObj.priceModifier || 0);
  const subtotal = pricePerPerson * numberOfTravelers;
  const taxes = subtotal * 0.1; // 10% tax
  const fees = 25; // Service fee

  // Calculate add-ons total
  let addOnsTotal = 0;
  if (addOns && addOns.length > 0) {
    addOnsTotal = addOns.reduce((sum, addOn) => sum + (addOn.price * (addOn.quantity || 1)), 0);
  }

  const totalPrice = subtotal + taxes + fees + addOnsTotal;

  // Create booking
  const booking = await Booking.create({
    user: req.user._id,
    trip: tripId,
    selectedDate: {
      departureDate: selectedDate.departureDate,
      returnDate: selectedDate.returnDate,
    },
    numberOfTravelers,
    travelers,
    pricing: {
      pricePerPerson,
      subtotal,
      taxes,
      fees,
      totalPrice,
      currency: trip.price.currency,
    },
    contactInfo,
    specialRequests,
    billingAddress,
    addOns,
    bookingStatus: 'pending',
    paymentStatus: 'pending',
  });

  // Update trip bookings count
  trip.currentBookings += numberOfTravelers;
  
  // Update available spots for the selected date
  const dateIndex = trip.availableDates.findIndex(
    (d) => new Date(d.departureDate).getTime() === new Date(selectedDate.departureDate).getTime()
  );
  if (dateIndex !== -1) {
    trip.availableDates[dateIndex].spotsAvailable -= numberOfTravelers;
  }
  
  await trip.save();

  // Add to user's booking history
  await User.findByIdAndUpdate(req.user._id, {
    $push: { bookingHistory: booking._id },
  });

  // Populate trip details for response
  await booking.populate('trip', 'name slug primaryImage duration destination');
  await booking.populate({
    path: 'trip',
    populate: { path: 'destination', select: 'name country' },
  });

  // Handle optional immediate payment
  let checkoutSession = null;
  if (req.body.payNow) {
    try {
      const session = await createCheckoutSession(booking, trip, req.user);
      booking.stripeSessionId = session.id;
      booking.paymentStatus = 'processing';
      await booking.save();
      
      checkoutSession = {
        sessionId: session.id,
        url: session.url,
      };
    } catch (error) {
      console.error('Failed to create checkout session during booking:', error);
      // Don't fail the booking, just return without session
      // User can pay later
    }
  }

  return createdResponse(res, { 
    booking,
    checkoutSession 
  }, 'Booking created successfully');
});

/**
 * Get user's bookings
 * GET /api/bookings
 */
const getMyBookings = catchAsync(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  const status = req.query.status;

  const query = { user: req.user._id };
  if (status) {
    query.bookingStatus = status;
  }

  const [bookings, total] = await Promise.all([
    Booking.find(query)
      .populate('trip', 'name slug primaryImage duration price destination')
      .populate({
        path: 'trip',
        populate: { path: 'destination', select: 'name country' },
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Booking.countDocuments(query),
  ]);

  return paginatedResponse(res, bookings, {
    page,
    limit,
    totalItems: total,
    totalPages: Math.ceil(total / limit),
  }, 'Bookings retrieved successfully');
});

/**
 * Get single booking
 * GET /api/bookings/:id
 */
const getBooking = catchAsync(async (req, res) => {
  const booking = await Booking.findById(req.params.id)
    .populate('trip')
    .populate({
      path: 'trip',
      populate: { path: 'destination' },
    })
    .populate('user', 'fullName email phone');

  if (!booking) {
    return errorResponse(res, 'Booking not found', 404);
  }

  // Check ownership (unless admin)
  if (booking.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    return errorResponse(res, 'Not authorized to view this booking', 403);
  }

  return successResponse(res, { booking }, 'Booking retrieved successfully');
});

/**
 * Get booking by confirmation code
 * GET /api/bookings/confirmation/:code
 */
const getBookingByCode = catchAsync(async (req, res) => {
  const { code } = req.params;

  const booking = await Booking.findOne({ confirmationCode: code.toUpperCase() })
    .populate('trip', 'name slug primaryImage duration price destination itinerary inclusions')
    .populate({
      path: 'trip',
      populate: { path: 'destination', select: 'name country' },
    });

  if (!booking) {
    return errorResponse(res, 'Booking not found', 404);
  }

  // For public access, return limited info
  // For authenticated owner/admin, return full details
  if (req.user && (booking.user.toString() === req.user._id.toString() || req.user.role === 'admin')) {
    await booking.populate('user', 'fullName email phone');
    return successResponse(res, { booking }, 'Booking retrieved successfully');
  }

  // Public view - limited info
  return successResponse(res, {
    booking: {
      confirmationCode: booking.confirmationCode,
      trip: booking.trip,
      selectedDate: booking.selectedDate,
      numberOfTravelers: booking.numberOfTravelers,
      bookingStatus: booking.bookingStatus,
    },
  }, 'Booking retrieved successfully');
});

/**
 * Cancel booking
 * PUT /api/bookings/:id/cancel
 */
const cancelBooking = catchAsync(async (req, res) => {
  const { reason } = req.body;

  const booking = await Booking.findById(req.params.id)
    .populate('trip')
    .populate('user', 'fullName email');

  if (!booking) {
    return errorResponse(res, 'Booking not found', 404);
  }

  // Check ownership
  if (booking.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    return errorResponse(res, 'Not authorized to cancel this booking', 403);
  }

  // Check if can be cancelled
  if (!booking.canBeCancelled()) {
    return errorResponse(res, 'This booking cannot be cancelled', 400);
  }

  // Calculate refund
  const refundAmount = calculateRefundAmount(booking, booking.trip);

  // Process refund if payment was made
  if (booking.paymentStatus === 'completed' && booking.stripePaymentIntentId && refundAmount > 0) {
    try {
      await createRefund(booking.stripePaymentIntentId, refundAmount, 'requested_by_customer');
      
      // Create refund payment record
      await Payment.create({
        user: booking.user._id,
        booking: booking._id,
        amount: refundAmount,
        currency: booking.pricing.currency,
        type: 'refund',
        status: 'succeeded',
        refundDetails: {
          originalPaymentId: booking.stripePaymentIntentId,
          refundAmount,
          refundReason: reason,
          refundedAt: new Date(),
        },
      });
    } catch (error) {
      console.error('Refund failed:', error);
      // Continue with cancellation even if refund fails
    }
  }

  // Update booking
  booking.bookingStatus = 'cancelled';
  booking.cancellation = {
    isCancelled: true,
    cancelledAt: new Date(),
    cancelledBy: req.user._id,
    reason,
    refundAmount,
    refundStatus: refundAmount > 0 ? 'completed' : 'denied',
  };
  await booking.save();

  // Update trip availability
  const trip = await Trip.findById(booking.trip._id);
  trip.currentBookings -= booking.numberOfTravelers;
  
  const dateIndex = trip.availableDates.findIndex(
    (d) => new Date(d.departureDate).getTime() === new Date(booking.selectedDate.departureDate).getTime()
  );
  if (dateIndex !== -1) {
    trip.availableDates[dateIndex].spotsAvailable += booking.numberOfTravelers;
  }
  await trip.save();

  // Send cancellation email
  sendBookingCancellationEmail(booking, booking.user, trip, refundAmount).catch((err) => {
    console.error('Failed to send cancellation email:', err);
  });

  return successResponse(res, {
    booking,
    refundAmount,
    refundStatus: refundAmount > 0 ? 'processed' : 'no-refund',
  }, 'Booking cancelled successfully');
});

/**
 * Get all bookings (Admin only)
 * GET /api/bookings/admin/all
 */
const getAllBookings = catchAsync(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const skip = (page - 1) * limit;

  const query = {};
  
  if (req.query.status) {
    query.bookingStatus = req.query.status;
  }
  
  if (req.query.paymentStatus) {
    query.paymentStatus = req.query.paymentStatus;
  }

  const [bookings, total] = await Promise.all([
    Booking.find(query)
      .populate('user', 'fullName email')
      .populate('trip', 'name slug')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Booking.countDocuments(query),
  ]);

  return paginatedResponse(res, bookings, {
    page,
    limit,
    totalItems: total,
    totalPages: Math.ceil(total / limit),
  }, 'Bookings retrieved successfully');
});

/**
 * Update booking status (Admin only)
 * PUT /api/bookings/:id/status
 */
const updateBookingStatus = catchAsync(async (req, res) => {
  const { bookingStatus, internalNotes } = req.body;

  const validStatuses = ['pending', 'confirmed', 'cancelled', 'completed', 'no-show'];
  if (!validStatuses.includes(bookingStatus)) {
    return errorResponse(res, 'Invalid booking status', 400);
  }

  const booking = await Booking.findByIdAndUpdate(
    req.params.id,
    { 
      bookingStatus,
      ...(internalNotes && { internalNotes }),
    },
    { new: true }
  ).populate('user', 'fullName email')
   .populate('trip', 'name slug');

  if (!booking) {
    return errorResponse(res, 'Booking not found', 404);
  }

  return successResponse(res, { booking }, 'Booking status updated successfully');
});

/**
 * Get booking statistics (Admin only)
 * GET /api/bookings/admin/stats
 */
const getBookingStats = catchAsync(async (req, res) => {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfYear = new Date(now.getFullYear(), 0, 1);

  const [
    totalBookings,
    monthlyBookings,
    yearlyBookings,
    statusBreakdown,
    revenueThisMonth,
  ] = await Promise.all([
    Booking.countDocuments(),
    Booking.countDocuments({ createdAt: { $gte: startOfMonth } }),
    Booking.countDocuments({ createdAt: { $gte: startOfYear } }),
    Booking.aggregate([
      { $group: { _id: '$bookingStatus', count: { $sum: 1 } } },
    ]),
    Booking.aggregate([
      { 
        $match: { 
          createdAt: { $gte: startOfMonth },
          paymentStatus: 'completed',
        },
      },
      { 
        $group: { 
          _id: null, 
          total: { $sum: '$pricing.totalPrice' },
        },
      },
    ]),
  ]);

  return successResponse(res, {
    totalBookings,
    monthlyBookings,
    yearlyBookings,
    statusBreakdown: statusBreakdown.reduce((acc, curr) => {
      acc[curr._id] = curr.count;
      return acc;
    }, {}),
    revenueThisMonth: revenueThisMonth[0]?.total || 0,
  }, 'Booking statistics retrieved');
});

module.exports = {
  createBooking,
  getMyBookings,
  getBooking,
  getBookingByCode,
  cancelBooking,
  getAllBookings,
  updateBookingStatus,
  getBookingStats,
};
