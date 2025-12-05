/**
 * Global Error Handler Middleware
 * Centralized error handling for the application
 */

const { AppError } = require('../utils/errors');

/**
 * Development Error Response
 */
const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    success: false,
    message: err.message,
    error: {
      message: err.message,
      statusCode: err.statusCode,
      stack: err.stack,
      errors: err.errors || null,
    },
    data: null,
    timestamp: new Date().toISOString(),
  });
};

/**
 * Production Error Response
 */
const sendErrorProd = (err, res) => {
  // Operational, trusted error: send message to client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
      error: {
        message: err.message,
        statusCode: err.statusCode,
        errors: err.errors || null,
      },
      data: null,
      timestamp: new Date().toISOString(),
    });
  } else {
    // Programming or unknown error: don't leak error details
    console.error('ERROR 💥:', err);

    res.status(500).json({
      success: false,
      message: 'Something went wrong!',
      error: {
        message: 'Internal server error',
        statusCode: 500,
      },
      data: null,
      timestamp: new Date().toISOString(),
    });
  }
};

/**
 * Handle specific error types
 */

// MongoDB CastError (invalid ObjectId)
const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};

// MongoDB Duplicate Key Error
const handleDuplicateFieldsDB = (err) => {
  const field = Object.keys(err.keyValue)[0];
  const value = err.keyValue[field];
  const message = `${field} '${value}' already exists. Please use another value.`;
  return new AppError(message, 409);
};

// MongoDB Validation Error
const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => ({
    field: el.path,
    message: el.message,
  }));
  const message = 'Validation failed. Please check your input.';
  const error = new AppError(message, 422);
  error.errors = errors;
  return error;
};

// JWT Error
const handleJWTError = () => {
  return new AppError('Invalid token. Please log in again.', 401);
};

// JWT Expired Error
const handleJWTExpiredError = () => {
  return new AppError('Your token has expired. Please log in again.', 401);
};

/**
 * Main Error Handler
 */
const errorHandler = (err, req, res, _next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else {
    let error = { ...err };
    error.message = err.message;

    // Handle specific error types
    if (err.name === 'CastError') error = handleCastErrorDB(err);
    if (err.code === 11000) error = handleDuplicateFieldsDB(err);
    if (err.name === 'ValidationError') error = handleValidationErrorDB(err);
    if (err.name === 'JsonWebTokenError') error = handleJWTError();
    if (err.name === 'TokenExpiredError') error = handleJWTExpiredError();

    sendErrorProd(error, res);
  }
};

/**
 * Catch Async Errors Wrapper
 * Wraps async functions to catch errors and pass to error handler
 */
const catchAsync = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};

/**
 * Not Found Handler
 * Handle 404 for unmatched routes
 */
const notFound = (req, res, _next) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
    error: {
      message: 'Not Found',
      statusCode: 404,
    },
    data: null,
    timestamp: new Date().toISOString(),
  });
};

module.exports = {
  errorHandler,
  catchAsync,
  notFound,
};
