/**
 * User Controller
 * Handle user profile and account management
 */

const { User, Booking } = require('../models');
const { successResponse, errorResponse, paginatedResponse } = require('../utils/responseFormatter');
const { catchAsync } = require('../middleware/errorHandler');

/**
 * Get user profile
 * GET /api/users/profile
 */
const getProfile = catchAsync(async (req, res) => {
  const user = await User.findById(req.user._id)
    .populate('preferences.favoriteDestinations', 'name slug primaryImage country');

  return successResponse(res, { user: user.toPublicJSON() }, 'Profile retrieved successfully');
});

/**
 * Update user profile
 * PUT /api/users/profile
 */
const updateProfile = catchAsync(async (req, res) => {
  const allowedFields = ['fullName', 'phone', 'address', 'bio', 'profilePicture', 'preferences'];
  
  const updates = {};
  Object.keys(req.body).forEach((key) => {
    if (allowedFields.includes(key)) {
      updates[key] = req.body[key];
    }
  });

  const user = await User.findByIdAndUpdate(
    req.user._id,
    { $set: updates },
    { new: true, runValidators: true }
  ).populate('preferences.favoriteDestinations', 'name slug primaryImage');

  return successResponse(res, { user: user.toPublicJSON() }, 'Profile updated successfully');
});

/**
 * Delete user account
 * DELETE /api/users/profile
 */
const deleteAccount = catchAsync(async (req, res) => {
  // Soft delete - deactivate account
  await User.findByIdAndUpdate(req.user._id, {
    isActive: false,
    email: `deleted_${Date.now()}_${req.user.email}`, // Prevent email reuse
    refreshTokens: [],
  });

  return successResponse(res, null, 'Account deleted successfully');
});

/**
 * Get user bookings
 * GET /api/users/bookings
 */
const getUserBookings = catchAsync(async (req, res) => {
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
        populate: { path: 'destination', select: 'name country' }
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
 * Add destination to favorites
 * POST /api/users/favorites/:destinationId
 */
const addToFavorites = catchAsync(async (req, res) => {
  const { destinationId } = req.params;

  const user = await User.findByIdAndUpdate(
    req.user._id,
    { $addToSet: { 'preferences.favoriteDestinations': destinationId } },
    { new: true }
  ).populate('preferences.favoriteDestinations', 'name slug primaryImage country');

  return successResponse(res, { 
    favorites: user.preferences.favoriteDestinations 
  }, 'Added to favorites');
});

/**
 * Remove destination from favorites
 * DELETE /api/users/favorites/:destinationId
 */
const removeFromFavorites = catchAsync(async (req, res) => {
  const { destinationId } = req.params;

  const user = await User.findByIdAndUpdate(
    req.user._id,
    { $pull: { 'preferences.favoriteDestinations': destinationId } },
    { new: true }
  ).populate('preferences.favoriteDestinations', 'name slug primaryImage country');

  return successResponse(res, { 
    favorites: user.preferences.favoriteDestinations 
  }, 'Removed from favorites');
});

/**
 * Get all users (Admin only)
 * GET /api/users
 */
const getAllUsers = catchAsync(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const skip = (page - 1) * limit;
  const role = req.query.role;
  const search = req.query.search;

  const query = { isActive: true };
  
  if (role) {
    query.role = role;
  }
  
  if (search) {
    query.$or = [
      { fullName: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
    ];
  }

  const [users, total] = await Promise.all([
    User.find(query)
      .select('-password -refreshTokens')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    User.countDocuments(query),
  ]);

  return paginatedResponse(res, users, {
    page,
    limit,
    totalItems: total,
    totalPages: Math.ceil(total / limit),
  }, 'Users retrieved successfully');
});

/**
 * Get single user (Admin only)
 * GET /api/users/:id
 */
const getUserById = catchAsync(async (req, res) => {
  const user = await User.findById(req.params.id)
    .select('-password -refreshTokens')
    .populate('preferences.favoriteDestinations', 'name slug')
    .populate({
      path: 'bookingHistory',
      options: { limit: 10, sort: { createdAt: -1 } },
    });

  if (!user) {
    return errorResponse(res, 'User not found', 404);
  }

  return successResponse(res, { user }, 'User retrieved successfully');
});

/**
 * Update user role (Admin only)
 * PUT /api/users/:id/role
 */
const updateUserRole = catchAsync(async (req, res) => {
  const { role } = req.body;

  if (!['customer', 'admin'].includes(role)) {
    return errorResponse(res, 'Invalid role', 400);
  }

  // Prevent self-demotion
  if (req.user._id.toString() === req.params.id && role !== 'admin') {
    return errorResponse(res, 'Cannot change your own role', 400);
  }

  const user = await User.findByIdAndUpdate(
    req.params.id,
    { role },
    { new: true }
  ).select('-password -refreshTokens');

  if (!user) {
    return errorResponse(res, 'User not found', 404);
  }

  return successResponse(res, { user }, 'User role updated successfully');
});

module.exports = {
  getProfile,
  updateProfile,
  deleteAccount,
  getUserBookings,
  addToFavorites,
  removeFromFavorites,
  getAllUsers,
  getUserById,
  updateUserRole,
};
