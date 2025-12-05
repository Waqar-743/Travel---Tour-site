/**
 * Validation Middleware
 * Input validation using express-validator
 */

const { body, param, query, validationResult } = require('express-validator');
const { errorResponse: _errorResponse } = require('../utils/responseFormatter');

/**
 * Handle validation errors
 */
const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().map((err) => ({
      field: err.path,
      message: err.msg,
      value: err.value,
    }));

    return res.status(422).json({
      success: false,
      message: 'Validation failed',
      error: {
        message: 'Validation failed',
        statusCode: 422,
        errors: formattedErrors,
      },
      data: null,
      timestamp: new Date().toISOString(),
    });
  }
  
  next();
};

/**
 * User Registration Validation
 */
const registerValidation = [
  body('fullName')
    .trim()
    .notEmpty().withMessage('Full name is required')
    .isLength({ min: 2, max: 100 }).withMessage('Full name must be between 2 and 100 characters'),
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email')
    .normalizeEmail(),
  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
    .matches(/\d/).withMessage('Password must contain at least one number'),
  body('phone')
    .optional()
    .trim()
    .matches(/^[+]?[\d\s-]{10,20}$/).withMessage('Please provide a valid phone number'),
  handleValidation,
];

/**
 * Login Validation
 */
const loginValidation = [
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email')
    .normalizeEmail(),
  body('password')
    .notEmpty().withMessage('Password is required'),
  handleValidation,
];

/**
 * Update Profile Validation
 */
const updateProfileValidation = [
  body('fullName')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 }).withMessage('Full name must be between 2 and 100 characters'),
  body('phone')
    .optional()
    .trim()
    .matches(/^[+]?[\d\s-]{10,20}$/).withMessage('Please provide a valid phone number'),
  body('bio')
    .optional()
    .trim()
    .isLength({ max: 500 }).withMessage('Bio cannot exceed 500 characters'),
  handleValidation,
];

/**
 * Destination Validation
 */
const destinationValidation = [
  body('name')
    .trim()
    .notEmpty().withMessage('Destination name is required')
    .isLength({ max: 100 }).withMessage('Name cannot exceed 100 characters'),
  body('description')
    .trim()
    .notEmpty().withMessage('Description is required')
    .isLength({ min: 50, max: 2000 }).withMessage('Description must be between 50 and 2000 characters'),
  body('country')
    .trim()
    .notEmpty().withMessage('Country is required'),
  handleValidation,
];

/**
 * Trip Validation
 */
const tripValidation = [
  body('name')
    .trim()
    .notEmpty().withMessage('Trip name is required')
    .isLength({ max: 150 }).withMessage('Name cannot exceed 150 characters'),
  body('description')
    .trim()
    .notEmpty().withMessage('Description is required')
    .isLength({ min: 100, max: 5000 }).withMessage('Description must be between 100 and 5000 characters'),
  body('destination')
    .notEmpty().withMessage('Destination is required')
    .isMongoId().withMessage('Invalid destination ID'),
  body('duration.days')
    .notEmpty().withMessage('Duration days is required')
    .isInt({ min: 1 }).withMessage('Duration must be at least 1 day'),
  body('duration.nights')
    .notEmpty().withMessage('Duration nights is required')
    .isInt({ min: 0 }).withMessage('Nights cannot be negative'),
  body('price.amount')
    .notEmpty().withMessage('Price is required')
    .isFloat({ min: 0 }).withMessage('Price cannot be negative'),
  body('maxCapacity')
    .notEmpty().withMessage('Max capacity is required')
    .isInt({ min: 1 }).withMessage('Max capacity must be at least 1'),
  handleValidation,
];

/**
 * Booking Validation
 */
const bookingValidation = [
  body('trip')
    .notEmpty().withMessage('Trip is required')
    .isMongoId().withMessage('Invalid trip ID'),
  body('selectedDate.departureDate')
    .notEmpty().withMessage('Departure date is required')
    .isISO8601().withMessage('Invalid departure date format'),
  body('selectedDate.returnDate')
    .notEmpty().withMessage('Return date is required')
    .isISO8601().withMessage('Invalid return date format'),
  body('numberOfTravelers')
    .notEmpty().withMessage('Number of travelers is required')
    .isInt({ min: 1 }).withMessage('At least 1 traveler is required'),
  body('contactInfo.email')
    .notEmpty().withMessage('Contact email is required')
    .isEmail().withMessage('Please provide a valid email'),
  handleValidation,
];

/**
 * Review Validation
 */
const reviewValidation = [
  body('trip')
    .notEmpty().withMessage('Trip is required')
    .isMongoId().withMessage('Invalid trip ID'),
  body('rating.overall')
    .notEmpty().withMessage('Overall rating is required')
    .isFloat({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  body('title')
    .trim()
    .notEmpty().withMessage('Review title is required')
    .isLength({ max: 100 }).withMessage('Title cannot exceed 100 characters'),
  body('content')
    .trim()
    .notEmpty().withMessage('Review content is required')
    .isLength({ min: 20, max: 2000 }).withMessage('Review must be between 20 and 2000 characters'),
  handleValidation,
];

/**
 * MongoDB ObjectId Validation
 */
const validateObjectId = (paramName = 'id') => [
  param(paramName)
    .isMongoId().withMessage(`Invalid ${paramName} format`),
  handleValidation,
];

/**
 * Pagination Query Validation
 */
const paginationValidation = [
  query('page')
    .optional()
    .isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  handleValidation,
];

module.exports = {
  handleValidation,
  registerValidation,
  loginValidation,
  updateProfileValidation,
  destinationValidation,
  tripValidation,
  bookingValidation,
  reviewValidation,
  validateObjectId,
  paginationValidation,
};
