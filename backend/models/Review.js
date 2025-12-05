/**
 * Review Model
 * Handles user reviews and ratings for trips
 */

const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
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
    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Booking', // Reference to the booking for verification
    },
    rating: {
      overall: {
        type: Number,
        required: [true, 'Overall rating is required'],
        min: [1, 'Rating must be at least 1'],
        max: [5, 'Rating cannot exceed 5'],
      },
      categories: {
        accommodation: { type: Number, min: 1, max: 5 },
        activities: { type: Number, min: 1, max: 5 },
        guide: { type: Number, min: 1, max: 5 },
        valueForMoney: { type: Number, min: 1, max: 5 },
        food: { type: Number, min: 1, max: 5 },
        transportation: { type: Number, min: 1, max: 5 },
      },
    },
    title: {
      type: String,
      required: [true, 'Review title is required'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    content: {
      type: String,
      required: [true, 'Review content is required'],
      minlength: [20, 'Review must be at least 20 characters'],
      maxlength: [2000, 'Review cannot exceed 2000 characters'],
    },
    pros: [{ type: String }],
    cons: [{ type: String }],
    images: [
      {
        url: { type: String },
        caption: { type: String },
      },
    ],
    travelDate: {
      type: Date,
    },
    traveledWith: {
      type: String,
      enum: ['solo', 'couple', 'family', 'friends', 'business'],
    },
    wouldRecommend: {
      type: Boolean,
      default: true,
    },
    helpfulVotes: {
      type: Number,
      default: 0,
    },
    votedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    isVerifiedPurchase: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'flagged'],
      default: 'pending',
    },
    moderationNotes: {
      type: String, // Admin notes for moderation
    },
    response: {
      content: { type: String },
      respondedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      respondedAt: { type: Date },
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Compound index to prevent duplicate reviews
reviewSchema.index({ user: 1, trip: 1 }, { unique: true });
reviewSchema.index({ trip: 1, status: 1 });
reviewSchema.index({ 'rating.overall': -1 });
reviewSchema.index({ createdAt: -1 });
reviewSchema.index({ status: 1 });

// Static method to calculate average rating for a trip
reviewSchema.statics.calculateAverageRating = async function (tripId) {
  const result = await this.aggregate([
    { $match: { trip: tripId, status: 'approved' } },
    {
      $group: {
        _id: '$trip',
        averageRating: { $avg: '$rating.overall' },
        reviewCount: { $sum: 1 },
      },
    },
  ]);

  try {
    const Trip = mongoose.model('Trip');
    if (result.length > 0) {
      await Trip.findByIdAndUpdate(tripId, {
        'rating.average': Math.round(result[0].averageRating * 10) / 10,
        'rating.count': result[0].reviewCount,
      });
    } else {
      await Trip.findByIdAndUpdate(tripId, {
        'rating.average': 0,
        'rating.count': 0,
      });
    }
  } catch (error) {
    console.error('Error updating trip rating:', error);
  }
};

// Update trip rating after save
reviewSchema.post('save', function () {
  if (this.status === 'approved') {
    this.constructor.calculateAverageRating(this.trip);
  }
});

// Update trip rating after remove
reviewSchema.post('remove', function () {
  this.constructor.calculateAverageRating(this.trip);
});

// Update trip rating after findOneAndDelete
reviewSchema.post('findOneAndDelete', async function (doc) {
  if (doc) {
    await doc.constructor.calculateAverageRating(doc.trip);
  }
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
