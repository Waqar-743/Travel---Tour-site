/**
 * Authentication Middleware
 * Verify JWT tokens and protect routes
 */

const { User } = require('../models');
const { verifyAccessToken, extractToken } = require('../utils/jwtHelper');
const { UnauthorizedError, ForbiddenError } = require('../utils/errors');
const { errorResponse } = require('../utils/responseFormatter');

/**
 * Protect routes - Require authentication
 */
const protect = async (req, res, next) => {
  try {
    // Extract token from header
    const token = extractToken(req);

    if (!token) {
      return errorResponse(res, 'Access denied. No token provided.', 401);
    }

    // Verify token
    const decoded = verifyAccessToken(token);

    // Find user
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return errorResponse(res, 'User not found.', 401);
    }

    if (!user.isActive) {
      return errorResponse(res, 'Account has been deactivated.', 401);
    }

    // Attach user to request
    req.user = user;
    next();
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return errorResponse(res, error.message, 401);
    }
    return errorResponse(res, 'Authentication failed.', 401);
  }
};

/**
 * Optional authentication - Attach user if token present, but don't require it
 */
const optionalAuth = async (req, res, next) => {
  try {
    const token = extractToken(req);

    if (token) {
      const decoded = verifyAccessToken(token);
      const user = await User.findById(decoded.id).select('-password');
      if (user && user.isActive) {
        req.user = user;
      }
    }
    next();
  } catch (error) {
    // Continue without user if token is invalid
    next();
  }
};

/**
 * Restrict to specific roles
 * @param  {...string} roles - Allowed roles
 */
const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return errorResponse(res, 'Authentication required.', 401);
    }

    if (!roles.includes(req.user.role)) {
      return errorResponse(res, 'You do not have permission to perform this action.', 403);
    }

    next();
  };
};

/**
 * Admin only middleware
 */
const adminOnly = (req, res, next) => {
  if (!req.user) {
    return errorResponse(res, 'Authentication required.', 401);
  }

  if (req.user.role !== 'admin') {
    return errorResponse(res, 'Admin access required.', 403);
  }

  next();
};

/**
 * Check if user owns the resource or is admin
 * @param {string} userIdField - Field name containing user ID in params
 */
const ownerOrAdmin = (userIdField = 'userId') => {
  return (req, res, next) => {
    if (!req.user) {
      return errorResponse(res, 'Authentication required.', 401);
    }

    const resourceUserId = req.params[userIdField];
    const isOwner = req.user._id.toString() === resourceUserId;
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
      return errorResponse(res, 'You do not have permission to access this resource.', 403);
    }

    next();
  };
};

module.exports = {
  protect,
  optionalAuth,
  restrictTo,
  adminOnly,
  ownerOrAdmin,
};
