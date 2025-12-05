/**
 * Destination Model
 * Represents travel destinations with details, attractions, and travel info
 */

const mongoose = require('mongoose');

const destinationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Destination name is required'],
      trim: true,
      unique: true,
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      minlength: [50, 'Description must be at least 50 characters'],
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
    },
    shortDescription: {
      type: String,
      maxlength: [200, 'Short description cannot exceed 200 characters'],
    },
    country: {
      type: String,
      required: [true, 'Country is required'],
      trim: true,
    },
    region: {
      type: String,
      trim: true,
    },
    city: {
      type: String,
      trim: true,
    },
    coordinates: {
      latitude: { type: Number },
      longitude: { type: Number },
    },
    mainAttractions: [
      {
        name: { type: String, required: true },
        description: { type: String },
        type: { type: String }, // e.g., 'natural', 'historical', 'cultural'
      },
    ],
    bestTimeToVisit: {
      months: [{ type: String }], // e.g., ['March', 'April', 'May']
      description: { type: String },
    },
    climate: {
      type: { type: String }, // e.g., 'tropical', 'temperate', 'arid'
      averageTemperature: {
        summer: { type: Number },
        winter: { type: Number },
      },
      rainySeasons: [{ type: String }],
    },
    images: [
      {
        url: { type: String, required: true },
        alt: { type: String },
        isPrimary: { type: Boolean, default: false },
      },
    ],
    primaryImage: {
      type: String,
    },
    averageCostPerDay: {
      budget: { type: Number }, // Budget travel
      midRange: { type: Number }, // Mid-range travel
      luxury: { type: Number }, // Luxury travel
      currency: { type: String, default: 'USD' },
    },
    visaRequirements: {
      type: String,
      maxlength: [1000, 'Visa requirements cannot exceed 1000 characters'],
    },
    travelTips: [
      {
        title: { type: String },
        content: { type: String },
      },
    ],
    languages: [{ type: String }],
    currency: {
      name: { type: String },
      code: { type: String },
      symbol: { type: String },
    },
    timezone: {
      type: String,
    },
    popularity: {
      type: Number,
      default: 0,
    },
    rating: {
      average: { type: Number, default: 0, min: 0, max: 5 },
      count: { type: Number, default: 0 },
    },
    tags: [{ type: String }], // e.g., ['beach', 'adventure', 'family-friendly']
    isFeatured: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes for faster queries (slug index is already created by unique: true)
destinationSchema.index({ name: 'text', country: 'text', description: 'text' });
destinationSchema.index({ country: 1 });
destinationSchema.index({ isFeatured: 1 });
destinationSchema.index({ 'rating.average': -1 });
destinationSchema.index({ popularity: -1 });

// Generate slug before saving
destinationSchema.pre('save', function (next) {
  if (this.isModified('name')) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
  }
  
  // Set short description if not provided
  if (!this.shortDescription && this.description) {
    this.shortDescription = this.description.substring(0, 197) + '...';
  }
  
  // Set primary image
  if (this.images && this.images.length > 0) {
    const primary = this.images.find(img => img.isPrimary);
    this.primaryImage = primary ? primary.url : this.images[0].url;
  }
  
  next();
});

// Virtual for trip count
destinationSchema.virtual('trips', {
  ref: 'Trip',
  localField: '_id',
  foreignField: 'destination',
});

const Destination = mongoose.model('Destination', destinationSchema);

module.exports = Destination;
