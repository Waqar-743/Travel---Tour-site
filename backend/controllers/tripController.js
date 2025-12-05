/**
 * Trip Controller
 * Handle trip/package CRUD operations
 */

const { Trip, Destination } = require('../models');
const { successResponse, createdResponse, errorResponse, paginatedResponse } = require('../utils/responseFormatter');
const { catchAsync } = require('../middleware/errorHandler');

/**
 * Get all trips
 * GET /api/trips
 */
const getAllTrips = catchAsync(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 12;
  const skip = (page - 1) * limit;

  // Build query
  const query = { status: 'active' };

  // Filters
  if (req.query.destination) {
    query.destination = req.query.destination;
  }

  if (req.query.minPrice || req.query.maxPrice) {
    query['price.amount'] = {};
    if (req.query.minPrice) query['price.amount'].$gte = parseInt(req.query.minPrice);
    if (req.query.maxPrice) query['price.amount'].$lte = parseInt(req.query.maxPrice);
  }

  if (req.query.minDays || req.query.maxDays) {
    query['duration.days'] = {};
    if (req.query.minDays) query['duration.days'].$gte = parseInt(req.query.minDays);
    if (req.query.maxDays) query['duration.days'].$lte = parseInt(req.query.maxDays);
  }

  if (req.query.difficulty) {
    query.difficultyLevel = req.query.difficulty;
  }

  if (req.query.type) {
    query.tripType = req.query.type;
  }

  if (req.query.featured === 'true') {
    query.isFeatured = true;
  }

  // Sort options
  let sort = { createdAt: -1 };
  switch (req.query.sort) {
    case 'price-low':
      sort = { 'price.amount': 1 };
      break;
    case 'price-high':
      sort = { 'price.amount': -1 };
      break;
    case 'rating':
      sort = { 'rating.average': -1 };
      break;
    case 'duration':
      sort = { 'duration.days': 1 };
      break;
    case 'popular':
      sort = { currentBookings: -1 };
      break;
  }

  const [trips, total] = await Promise.all([
    Trip.find(query)
      .populate('destination', 'name slug country primaryImage')
      .select('name slug shortDescription duration price primaryImage rating difficultyLevel tripType maxCapacity currentBookings highlights isFeatured')
      .sort(sort)
      .skip(skip)
      .limit(limit),
    Trip.countDocuments(query),
  ]);

  return paginatedResponse(res, trips, {
    page,
    limit,
    totalItems: total,
    totalPages: Math.ceil(total / limit),
  }, 'Trips retrieved successfully');
});

/**
 * Get single trip
 * GET /api/trips/:id
 */
const getTrip = catchAsync(async (req, res) => {
  const { id } = req.params;

  // Support both ObjectId and slug
  const query = id.match(/^[0-9a-fA-F]{24}$/)
    ? { _id: id }
    : { slug: id };

  const trip = await Trip.findOne({ ...query, status: { $ne: 'cancelled' } })
    .populate('destination', 'name slug country region primaryImage climate visaRequirements currency')
    .populate('createdBy', 'fullName');

  if (!trip) {
    return errorResponse(res, 'Trip not found', 404);
  }

  // Get related trips
  const relatedTrips = await Trip.find({
    destination: trip.destination._id,
    _id: { $ne: trip._id },
    status: 'active',
  })
    .select('name slug primaryImage price duration rating')
    .limit(4);

  return successResponse(res, { trip, relatedTrips }, 'Trip retrieved successfully');
});

/**
 * Get trips by destination
 * GET /api/trips/destination/:destinationId
 */
const getTripsByDestination = catchAsync(async (req, res) => {
  const { destinationId } = req.params;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const query = {
    destination: destinationId,
    status: 'active',
  };

  const [trips, total] = await Promise.all([
    Trip.find(query)
      .select('name slug shortDescription duration price primaryImage rating difficultyLevel')
      .sort({ 'rating.average': -1 })
      .skip(skip)
      .limit(limit),
    Trip.countDocuments(query),
  ]);

  return paginatedResponse(res, trips, {
    page,
    limit,
    totalItems: total,
    totalPages: Math.ceil(total / limit),
  }, 'Trips retrieved successfully');
});

/**
 * Search trips
 * GET /api/trips/search
 */
const searchTrips = catchAsync(async (req, res) => {
  const { q } = req.query;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const query = { status: 'active' };

  if (q) {
    query.$text = { $search: q };
  }

  const [trips, total] = await Promise.all([
    Trip.find(query)
      .populate('destination', 'name country')
      .select('name slug shortDescription duration price primaryImage rating destination')
      .sort(q ? { score: { $meta: 'textScore' } } : { 'rating.average': -1 })
      .skip(skip)
      .limit(limit),
    Trip.countDocuments(query),
  ]);

  return paginatedResponse(res, trips, {
    page,
    limit,
    totalItems: total,
    totalPages: Math.ceil(total / limit),
  }, 'Search results');
});

/**
 * Get featured trips
 * GET /api/trips/featured
 */
const getFeaturedTrips = catchAsync(async (req, res) => {
  const limit = parseInt(req.query.limit) || 6;

  const trips = await Trip.find({
    status: 'active',
    isFeatured: true,
  })
    .populate('destination', 'name country')
    .select('name slug shortDescription duration price primaryImage rating destination highlights')
    .sort({ 'rating.average': -1 })
    .limit(limit);

  return successResponse(res, { trips }, 'Featured trips retrieved');
});

/**
 * Get upcoming trips (with available dates)
 * GET /api/trips/upcoming
 */
const getUpcomingTrips = catchAsync(async (req, res) => {
  const limit = parseInt(req.query.limit) || 8;
  const now = new Date();

  const trips = await Trip.find({
    status: 'active',
    'availableDates.departureDate': { $gte: now },
    'availableDates.spotsAvailable': { $gt: 0 },
  })
    .populate('destination', 'name country')
    .select('name slug shortDescription duration price primaryImage rating availableDates')
    .sort({ 'availableDates.0.departureDate': 1 })
    .limit(limit);

  return successResponse(res, { trips }, 'Upcoming trips retrieved');
});

/**
 * Create trip (Admin only)
 * POST /api/trips
 */
const createTrip = catchAsync(async (req, res) => {
  // Verify destination exists
  const destination = await Destination.findById(req.body.destination);
  if (!destination) {
    return errorResponse(res, 'Destination not found', 404);
  }

  const tripData = {
    ...req.body,
    createdBy: req.user._id,
  };

  const trip = await Trip.create(tripData);
  await trip.populate('destination', 'name slug country');

  return createdResponse(res, { trip }, 'Trip created successfully');
});

/**
 * Update trip (Admin only)
 * PUT /api/trips/:id
 */
const updateTrip = catchAsync(async (req, res) => {
  const trip = await Trip.findByIdAndUpdate(
    req.params.id,
    { $set: req.body },
    { new: true, runValidators: true }
  ).populate('destination', 'name slug country');

  if (!trip) {
    return errorResponse(res, 'Trip not found', 404);
  }

  return successResponse(res, { trip }, 'Trip updated successfully');
});

/**
 * Delete trip (Admin only)
 * DELETE /api/trips/:id
 */
const deleteTrip = catchAsync(async (req, res) => {
  const trip = await Trip.findByIdAndUpdate(
    req.params.id,
    { status: 'cancelled' },
    { new: true }
  );

  if (!trip) {
    return errorResponse(res, 'Trip not found', 404);
  }

  return successResponse(res, null, 'Trip deleted successfully');
});

/**
 * Check trip availability
 * GET /api/trips/:id/availability
 */
const checkAvailability = catchAsync(async (req, res) => {
  const trip = await Trip.findById(req.params.id)
    .select('availableDates maxCapacity currentBookings');

  if (!trip) {
    return errorResponse(res, 'Trip not found', 404);
  }

  const now = new Date();
  const availableDates = trip.availableDates
    .filter(date => new Date(date.departureDate) > now && date.spotsAvailable > 0)
    .map(date => ({
      departureDate: date.departureDate,
      returnDate: date.returnDate,
      spotsAvailable: date.spotsAvailable,
      priceModifier: date.priceModifier,
    }));

  return successResponse(res, {
    tripId: trip._id,
    availableDates,
    spotsRemaining: trip.maxCapacity - trip.currentBookings,
  }, 'Availability retrieved');
});

module.exports = {
  getAllTrips,
  getTrip,
  getTripsByDestination,
  searchTrips,
  getFeaturedTrips,
  getUpcomingTrips,
  createTrip,
  updateTrip,
  deleteTrip,
  checkAvailability,
};
