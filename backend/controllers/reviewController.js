/**
 * Review Controller
 * Handle review creation, management, and retrieval
 */

const { Review, Trip, Booking } = require('../models');
const mongoose = require('mongoose');
const { successResponse, createdResponse, errorResponse, paginatedResponse } = require('../utils/responseFormatter');
const { catchAsync } = require('../middleware/errorHandler');

/**
 * Create review
 * POST /api/reviews
 */
const createReview = catchAsync(async (req, res) => {
  const { trip: tripId, rating, title, content, pros, cons, images, travelDate, traveledWith } = req.body;

  // Check if trip exists
  const trip = await Trip.findById(tripId);
  if (!trip) {
    return errorResponse(res, 'Trip not found', 404);
  }

  // Check if user has already reviewed this trip
  const existingReview = await Review.findOne({
    user: req.user._id,
    trip: tripId,
  });

  if (existingReview) {
    return errorResponse(res, 'You have already reviewed this trip', 409);
  }

  // Check if user has booked this trip (for verified purchase)
  const hasBooking = await Booking.findOne({
    user: req.user._id,
    trip: tripId,
    bookingStatus: { $in: ['confirmed', 'completed'] },
  });

  const review = await Review.create({
    user: req.user._id,
    trip: tripId,
    booking: hasBooking?._id,
    rating,
    title,
    content,
    pros,
    cons,
    images,
    travelDate,
    traveledWith,
    isVerifiedPurchase: !!hasBooking,
    status: 'approved', // Auto-approve for now, can change to 'pending' for moderation
  });

  await review.populate('user', 'fullName profilePicture');

  return createdResponse(res, { review }, 'Review submitted successfully');
});

/**
 * Get reviews for a trip
 * GET /api/reviews/trip/:tripId
 */
const getTripReviews = catchAsync(async (req, res) => {
  const { tripId } = req.params;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  // Sort options
  let sort = { createdAt: -1 };
  if (req.query.sort === 'rating-high') {
    sort = { 'rating.overall': -1 };
  } else if (req.query.sort === 'rating-low') {
    sort = { 'rating.overall': 1 };
  } else if (req.query.sort === 'helpful') {
    sort = { helpfulVotes: -1 };
  }

  // Filter by rating
  const query = { trip: tripId, status: 'approved' };
  if (req.query.rating) {
    query['rating.overall'] = parseInt(req.query.rating);
  }

  const [reviews, total, ratingBreakdown] = await Promise.all([
    Review.find(query)
      .populate('user', 'fullName profilePicture')
      .sort(sort)
      .skip(skip)
      .limit(limit),
    Review.countDocuments(query),
    Review.aggregate([
      { $match: { trip: new mongoose.Types.ObjectId(tripId), status: 'approved' } },
      {
        $group: {
          _id: '$rating.overall',
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: -1 } },
    ]),
  ]);

  // Calculate rating distribution
  const ratingDistribution = {};
  for (let i = 5; i >= 1; i--) {
    const found = ratingBreakdown.find((r) => r._id === i);
    ratingDistribution[i] = found ? found.count : 0;
  }

  return paginatedResponse(res, reviews, {
    page,
    limit,
    totalItems: total,
    totalPages: Math.ceil(total / limit),
  }, 'Reviews retrieved successfully');
});

/**
 * Get single review
 * GET /api/reviews/:id
 */
const getReview = catchAsync(async (req, res) => {
  const review = await Review.findById(req.params.id)
    .populate('user', 'fullName profilePicture')
    .populate('trip', 'name slug primaryImage');

  if (!review) {
    return errorResponse(res, 'Review not found', 404);
  }

  return successResponse(res, { review }, 'Review retrieved successfully');
});

/**
 * Update review
 * PUT /api/reviews/:id
 */
const updateReview = catchAsync(async (req, res) => {
  const review = await Review.findById(req.params.id);

  if (!review) {
    return errorResponse(res, 'Review not found', 404);
  }

  // Check ownership
  if (review.user.toString() !== req.user._id.toString()) {
    return errorResponse(res, 'Not authorized to update this review', 403);
  }

  const allowedUpdates = ['rating', 'title', 'content', 'pros', 'cons', 'images'];
  const updates = {};
  
  Object.keys(req.body).forEach((key) => {
    if (allowedUpdates.includes(key)) {
      updates[key] = req.body[key];
    }
  });

  const updatedReview = await Review.findByIdAndUpdate(
    req.params.id,
    { $set: updates },
    { new: true, runValidators: true }
  ).populate('user', 'fullName profilePicture');

  return successResponse(res, { review: updatedReview }, 'Review updated successfully');
});

/**
 * Delete review
 * DELETE /api/reviews/:id
 */
const deleteReview = catchAsync(async (req, res) => {
  const review = await Review.findById(req.params.id);

  if (!review) {
    return errorResponse(res, 'Review not found', 404);
  }

  // Check ownership (or admin)
  if (review.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    return errorResponse(res, 'Not authorized to delete this review', 403);
  }

  await Review.findByIdAndDelete(req.params.id);

  return successResponse(res, null, 'Review deleted successfully');
});

/**
 * Vote review as helpful
 * POST /api/reviews/:id/helpful
 */
const voteHelpful = catchAsync(async (req, res) => {
  const review = await Review.findById(req.params.id);

  if (!review) {
    return errorResponse(res, 'Review not found', 404);
  }

  // Check if already voted
  if (review.votedBy.includes(req.user._id)) {
    return errorResponse(res, 'You have already voted for this review', 400);
  }

  review.helpfulVotes += 1;
  review.votedBy.push(req.user._id);
  await review.save();

  return successResponse(res, { 
    helpfulVotes: review.helpfulVotes 
  }, 'Vote recorded successfully');
});

/**
 * Get user's reviews
 * GET /api/reviews/user/:userId
 */
const getUserReviews = catchAsync(async (req, res) => {
  const { userId } = req.params;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const [reviews, total] = await Promise.all([
    Review.find({ user: userId, status: 'approved' })
      .populate('trip', 'name slug primaryImage')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Review.countDocuments({ user: userId, status: 'approved' }),
  ]);

  return paginatedResponse(res, reviews, {
    page,
    limit,
    totalItems: total,
    totalPages: Math.ceil(total / limit),
  }, 'User reviews retrieved');
});

/**
 * Get all reviews (Admin only)
 * GET /api/reviews/admin/all
 */
const getAllReviews = catchAsync(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const skip = (page - 1) * limit;

  const query = {};
  if (req.query.status) {
    query.status = req.query.status;
  }

  const [reviews, total] = await Promise.all([
    Review.find(query)
      .populate('user', 'fullName email')
      .populate('trip', 'name slug')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Review.countDocuments(query),
  ]);

  return paginatedResponse(res, reviews, {
    page,
    limit,
    totalItems: total,
    totalPages: Math.ceil(total / limit),
  }, 'Reviews retrieved');
});

/**
 * Moderate review (Admin only)
 * PUT /api/reviews/:id/moderate
 */
const moderateReview = catchAsync(async (req, res) => {
  const { status, moderationNotes, response } = req.body;

  const validStatuses = ['pending', 'approved', 'rejected', 'flagged'];
  if (status && !validStatuses.includes(status)) {
    return errorResponse(res, 'Invalid status', 400);
  }

  const updates = {};
  if (status) updates.status = status;
  if (moderationNotes) updates.moderationNotes = moderationNotes;
  if (response) {
    updates.response = {
      content: response,
      respondedBy: req.user._id,
      respondedAt: new Date(),
    };
  }

  const review = await Review.findByIdAndUpdate(
    req.params.id,
    { $set: updates },
    { new: true }
  ).populate('user', 'fullName email')
   .populate('trip', 'name slug');

  if (!review) {
    return errorResponse(res, 'Review not found', 404);
  }

  return successResponse(res, { review }, 'Review moderated successfully');
});

module.exports = {
  createReview,
  getTripReviews,
  getReview,
  updateReview,
  deleteReview,
  voteHelpful,
  getUserReviews,
  getAllReviews,
  moderateReview,
};
