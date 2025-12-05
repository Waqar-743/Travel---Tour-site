/**
 * Destination Controller
 * Handle destination CRUD operations
 */

const { Destination, Trip } = require('../models');
const { successResponse, createdResponse, errorResponse, paginatedResponse } = require('../utils/responseFormatter');
const { catchAsync } = require('../middleware/errorHandler');

/**
 * Get all destinations
 * GET /api/destinations
 */
const getAllDestinations = catchAsync(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 12;
  const skip = (page - 1) * limit;
  
  // Build query
  const query = { isActive: true };
  
  // Filters
  if (req.query.country) {
    query.country = { $regex: req.query.country, $options: 'i' };
  }
  
  if (req.query.featured === 'true') {
    query.isFeatured = true;
  }
  
  if (req.query.tags) {
    const tags = req.query.tags.split(',');
    query.tags = { $in: tags };
  }

  // Sort options
  let sort = { createdAt: -1 };
  if (req.query.sort === 'popular') {
    sort = { popularity: -1 };
  } else if (req.query.sort === 'rating') {
    sort = { 'rating.average': -1 };
  } else if (req.query.sort === 'name') {
    sort = { name: 1 };
  }

  const [destinations, total] = await Promise.all([
    Destination.find(query)
      .select('name slug shortDescription country region primaryImage rating popularity tags isFeatured')
      .sort(sort)
      .skip(skip)
      .limit(limit),
    Destination.countDocuments(query),
  ]);

  return paginatedResponse(res, destinations, {
    page,
    limit,
    totalItems: total,
    totalPages: Math.ceil(total / limit),
  }, 'Destinations retrieved successfully');
});

/**
 * Get single destination
 * GET /api/destinations/:id
 */
const getDestination = catchAsync(async (req, res) => {
  const { id } = req.params;
  
  // Support both ObjectId and slug
  const query = id.match(/^[0-9a-fA-F]{24}$/) 
    ? { _id: id } 
    : { slug: id };

  const destination = await Destination.findOne({ ...query, isActive: true });

  if (!destination) {
    return errorResponse(res, 'Destination not found', 404);
  }

  // Increment popularity
  destination.popularity += 1;
  await destination.save({ validateBeforeSave: false });

  // Get associated trips
  const trips = await Trip.find({ 
    destination: destination._id, 
    status: 'active' 
  })
    .select('name slug shortDescription duration price primaryImage rating difficultyLevel')
    .limit(6);

  return successResponse(res, { 
    destination, 
    trips 
  }, 'Destination retrieved successfully');
});

/**
 * Search destinations
 * GET /api/destinations/search
 */
const searchDestinations = catchAsync(async (req, res) => {
  const { q, country, minBudget, maxBudget } = req.query;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const query = { isActive: true };

  if (q) {
    query.$text = { $search: q };
  }

  if (country) {
    query.country = { $regex: country, $options: 'i' };
  }

  if (minBudget || maxBudget) {
    query['averageCostPerDay.midRange'] = {};
    if (minBudget) query['averageCostPerDay.midRange'].$gte = parseInt(minBudget);
    if (maxBudget) query['averageCostPerDay.midRange'].$lte = parseInt(maxBudget);
  }

  const [destinations, total] = await Promise.all([
    Destination.find(query)
      .select('name slug shortDescription country region primaryImage rating')
      .sort(q ? { score: { $meta: 'textScore' } } : { popularity: -1 })
      .skip(skip)
      .limit(limit),
    Destination.countDocuments(query),
  ]);

  return paginatedResponse(res, destinations, {
    page,
    limit,
    totalItems: total,
    totalPages: Math.ceil(total / limit),
  }, 'Search results');
});

/**
 * Get featured destinations
 * GET /api/destinations/featured
 */
const getFeaturedDestinations = catchAsync(async (req, res) => {
  const limit = parseInt(req.query.limit) || 6;

  const destinations = await Destination.find({ 
    isActive: true, 
    isFeatured: true 
  })
    .select('name slug shortDescription country primaryImage rating')
    .sort({ popularity: -1 })
    .limit(limit);

  return successResponse(res, { destinations }, 'Featured destinations retrieved');
});

/**
 * Get popular destinations
 * GET /api/destinations/popular
 */
const getPopularDestinations = catchAsync(async (req, res) => {
  const limit = parseInt(req.query.limit) || 8;

  const destinations = await Destination.find({ isActive: true })
    .select('name slug shortDescription country primaryImage rating popularity')
    .sort({ popularity: -1 })
    .limit(limit);

  return successResponse(res, { destinations }, 'Popular destinations retrieved');
});

/**
 * Create destination (Admin only)
 * POST /api/destinations
 */
const createDestination = catchAsync(async (req, res) => {
  const destinationData = {
    ...req.body,
    createdBy: req.user._id,
  };

  const destination = await Destination.create(destinationData);

  return createdResponse(res, { destination }, 'Destination created successfully');
});

/**
 * Update destination (Admin only)
 * PUT /api/destinations/:id
 */
const updateDestination = catchAsync(async (req, res) => {
  const destination = await Destination.findByIdAndUpdate(
    req.params.id,
    { $set: req.body },
    { new: true, runValidators: true }
  );

  if (!destination) {
    return errorResponse(res, 'Destination not found', 404);
  }

  return successResponse(res, { destination }, 'Destination updated successfully');
});

/**
 * Delete destination (Admin only)
 * DELETE /api/destinations/:id
 */
const deleteDestination = catchAsync(async (req, res) => {
  // Soft delete
  const destination = await Destination.findByIdAndUpdate(
    req.params.id,
    { isActive: false },
    { new: true }
  );

  if (!destination) {
    return errorResponse(res, 'Destination not found', 404);
  }

  return successResponse(res, null, 'Destination deleted successfully');
});

/**
 * Get all countries with destinations
 * GET /api/destinations/countries
 */
const getCountries = catchAsync(async (req, res) => {
  const countries = await Destination.aggregate([
    { $match: { isActive: true } },
    { 
      $group: { 
        _id: '$country', 
        count: { $sum: 1 },
        image: { $first: '$primaryImage' }
      } 
    },
    { $sort: { count: -1 } },
  ]);

  return successResponse(res, { countries }, 'Countries retrieved');
});

module.exports = {
  getAllDestinations,
  getDestination,
  searchDestinations,
  getFeaturedDestinations,
  getPopularDestinations,
  createDestination,
  updateDestination,
  deleteDestination,
  getCountries,
};
