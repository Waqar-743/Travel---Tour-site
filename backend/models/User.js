/**
 * User Model
 * Handles user data including authentication, profile, and preferences
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email',
      ],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false, // Don't include password in queries by default
    },
    phone: {
      type: String,
      trim: true,
      match: [/^[+]?[\d\s-]{10,20}$/, 'Please provide a valid phone number'],
    },
    address: {
      street: { type: String, trim: true },
      city: { type: String, trim: true },
      state: { type: String, trim: true },
      country: { type: String, trim: true },
      postalCode: { type: String, trim: true },
    },
    profilePicture: {
      type: String,
      default: 'https://ui-avatars.com/api/?name=User&background=random',
    },
    bio: {
      type: String,
      maxlength: [500, 'Bio cannot exceed 500 characters'],
    },
    role: {
      type: String,
      enum: ['customer', 'admin'],
      default: 'customer',
    },
    preferences: {
      favoriteDestinations: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Destination' }],
      budgetRange: {
        min: { type: Number, default: 0 },
        max: { type: Number, default: 10000 },
      },
      preferredTripTypes: [{ type: String }], // e.g., ['adventure', 'relaxation', 'cultural']
      dietaryRestrictions: [{ type: String }],
    },
    bookingHistory: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Booking' }],
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    emailVerificationToken: {
      type: String,
      select: false,
    },
    emailVerificationTokenExpires: {
      type: Date,
      select: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    lastLogin: {
      type: Date,
    },
    refreshTokens: [{ type: String }], // Store active refresh tokens
    passwordResetToken: String,
    passwordResetExpires: Date,
  },
  {
    timestamps: true, // Adds createdAt and updatedAt
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Index for faster queries (email index is already created by unique: true)
userSchema.index({ role: 1 });
userSchema.index({ createdAt: -1 });

// Hash password before saving
userSchema.pre('save', async function (next) {
  // Only hash if password is modified
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const crypto = require('crypto');

// ... existing code ...

// Generate email verification token (crypto token)
userSchema.methods.generateEmailVerificationToken = function () {
  // Generate random hex string
  const verificationToken = crypto.randomBytes(32).toString('hex');
  
  // Hash token and save to database
  this.emailVerificationToken = crypto
    .createHash('sha256')
    .update(verificationToken)
    .digest('hex');
    
  // Token expires in 24 hours
  this.emailVerificationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);
  
  return verificationToken; // Return unhashed token to send in email
};

// Verify email token
userSchema.methods.verifyEmailToken = function (token) {
  if (!this.emailVerificationToken || !this.emailVerificationTokenExpires) {
    return { valid: false, reason: 'no_token' };
  }
  
  if (new Date() > this.emailVerificationTokenExpires) {
    return { valid: false, reason: 'expired' };
  }
  
  // Hash the provided token to compare with stored hash
  const hashedToken = crypto
    .createHash('sha256')
    .update(token)
    .digest('hex');
  
  if (this.emailVerificationToken !== hashedToken) {
    return { valid: false, reason: 'invalid' };
  }
  
  return { valid: true };
};

// Generate password reset token
userSchema.methods.generatePasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');
  
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
    
  // Token expires in 1 hour
  this.passwordResetExpires = new Date(Date.now() + 60 * 60 * 1000);
  
  return resetToken;
};

// Verify password reset token
userSchema.methods.verifyPasswordResetToken = function (token) {
  if (!this.passwordResetToken || !this.passwordResetExpires) {
    return { valid: false, reason: 'no_token' };
  }
  
  if (new Date() > this.passwordResetExpires) {
    return { valid: false, reason: 'expired' };
  }
  
  const hashedToken = crypto
    .createHash('sha256')
    .update(token)
    .digest('hex');
  
  if (this.passwordResetToken !== hashedToken) {
    return { valid: false, reason: 'invalid' };
  }
  
  return { valid: true };
};

// Get public profile (without sensitive data)
userSchema.methods.toPublicJSON = function () {
  return {
    id: this._id,
    fullName: this.fullName,
    email: this.email,
    phone: this.phone,
    address: this.address,
    profilePicture: this.profilePicture,
    bio: this.bio,
    role: this.role,
    preferences: this.preferences,
    isEmailVerified: this.isEmailVerified,
    createdAt: this.createdAt,
    lastLogin: this.lastLogin,
  };
};

// Virtual for booking count
userSchema.virtual('bookingCount').get(function () {
  return this.bookingHistory ? this.bookingHistory.length : 0;
});

const User = mongoose.model('User', userSchema);

module.exports = User;
