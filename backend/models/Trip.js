/**
 * Trip/Package Model
 * Represents travel packages with itineraries, pricing, and availability
 */

const mongoose = require('mongoose');

const itineraryDaySchema = new mongoose.Schema({
  day: { type: Number, required: true },
  title: { type: String, required: true },
  description: { type: String },
  activities: [
    {
      time: { type: String }, // e.g., '09:00 AM'
      activity: { type: String, required: true },
      description: { type: String },
      location: { type: String },
      duration: { type: String }, // e.g., '2 hours'
      included: { type: Boolean, default: true },
    },
  ],
  meals: {
    breakfast: { type: Boolean, default: false },
    lunch: { type: Boolean, default: false },
    dinner: { type: Boolean, default: false },
  },
  accommodation: {
    name: { type: String },
    type: { type: String }, // e.g., 'hotel', 'resort', 'camping'
    rating: { type: Number },
  },
});

const tripSchema = new mongoose.Schema(
  {
    packageId: {
      type: Number,
      unique: true,
      sparse: true // Allows null/undefined values to not conflict
    },
    name: {
      type: String,
      required: [true, 'Trip name is required'],
      trim: true,
      maxlength: [150, 'Name cannot exceed 150 characters'],
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      minlength: [100, 'Description must be at least 100 characters'],
      maxlength: [5000, 'Description cannot exceed 5000 characters'],
    },
    shortDescription: {
      type: String,
      maxlength: [300, 'Short description cannot exceed 300 characters'],
    },
    destination: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Destination',
      required: [true, 'Destination is required'],
    },
    duration: {
      days: { type: Number, required: true, min: 1 },
      nights: { type: Number, required: true, min: 0 },
    },
    price: {
      amount: { type: Number, required: true, min: 0 },
      currency: { type: String, default: 'USD' },
      perPerson: { type: Boolean, default: true },
      originalPrice: { type: Number }, // For showing discounts
      discountPercentage: { type: Number, min: 0, max: 100 },
    },
    availableDates: [
      {
        departureDate: { type: Date, required: true },
        returnDate: { type: Date, required: true },
        spotsAvailable: { type: Number, required: true },
        priceModifier: { type: Number, default: 0 }, // +/- from base price
      },
    ],
    maxCapacity: {
      type: Number,
      required: true,
      min: 1,
    },
    minTravelers: {
      type: Number,
      default: 1,
      min: 1,
    },
    currentBookings: {
      type: Number,
      default: 0,
    },
    inclusions: {
      flights: { type: Boolean, default: false },
      hotel: { type: Boolean, default: true },
      meals: {
        breakfast: { type: Boolean, default: true },
        lunch: { type: Boolean, default: false },
        dinner: { type: Boolean, default: false },
      },
      transfers: { type: Boolean, default: true },
      activities: [{ type: String }],
      others: [{ type: String }],
    },
    exclusions: [{ type: String }],
    itinerary: [itineraryDaySchema],
    guide: {
      name: { type: String },
      bio: { type: String },
      image: { type: String },
      languages: [{ type: String }],
      experience: { type: String },
    },
    difficultyLevel: {
      type: String,
      enum: ['easy', 'moderate', 'challenging', 'extreme'],
      default: 'moderate',
    },
    tripType: {
      type: String,
      enum: ['adventure', 'relaxation', 'cultural', 'wildlife', 'beach', 'mountain', 'city', 'cruise', 'mixed'],
      default: 'mixed',
    },
    ageRestrictions: {
      minAge: { type: Number, default: 0 },
      maxAge: { type: Number, default: 100 },
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
    highlights: [{ type: String }],
    requirements: [{ type: String }], // e.g., 'Valid passport', 'Travel insurance'
    cancellationPolicy: {
      type: String,
      enum: ['flexible', 'moderate', 'strict', 'non-refundable'],
      default: 'moderate',
    },
    cancellationDetails: {
      type: String,
    },
    rating: {
      average: { type: Number, default: 0, min: 0, max: 5 },
      count: { type: Number, default: 0 },
    },
    status: {
      type: String,
      enum: ['draft', 'active', 'paused', 'sold-out', 'cancelled'],
      default: 'active',
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    tags: [{ type: String }],
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

// Indexes
tripSchema.index({ name: 'text', description: 'text' });
tripSchema.index({ destination: 1 });
tripSchema.index({ 'price.amount': 1 });
tripSchema.index({ status: 1 });
tripSchema.index({ isFeatured: 1 });
tripSchema.index({ 'duration.days': 1 });
tripSchema.index({ difficultyLevel: 1 });
tripSchema.index({ tripType: 1 });
tripSchema.index({ 'rating.average': -1 });

// Generate slug before saving
tripSchema.pre('save', function (next) {
  if (this.isModified('name')) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
  }
  
  // Set short description if not provided
  if (!this.shortDescription && this.description) {
    this.shortDescription = this.description.substring(0, 297) + '...';
  }
  
  // Set primary image
  if (this.images && this.images.length > 0) {
    const primary = this.images.find(img => img.isPrimary);
    this.primaryImage = primary ? primary.url : this.images[0].url;
  }
  
  // Calculate discount percentage
  if (this.price.originalPrice && this.price.amount < this.price.originalPrice) {
    this.price.discountPercentage = Math.round(
      ((this.price.originalPrice - this.price.amount) / this.price.originalPrice) * 100
    );
  }
  
  next();
});

// Virtual for availability status
tripSchema.virtual('availabilityStatus').get(function () {
  if (this.currentBookings >= this.maxCapacity) return 'sold-out';
  if (this.currentBookings >= this.maxCapacity * 0.8) return 'almost-full';
  return 'available';
});

// Virtual for spots remaining
tripSchema.virtual('spotsRemaining').get(function () {
  return Math.max(0, this.maxCapacity - this.currentBookings);
});

const Trip = mongoose.model('Trip', tripSchema);

module.exports = Trip;
