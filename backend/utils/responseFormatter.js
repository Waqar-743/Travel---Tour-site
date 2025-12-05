/**
 * Response Formatter
 * Standardized API response format
 */

/**
 * Success Response
 * @param {Object} res - Express response object
 * @param {Object} data - Response data
 * @param {string} message - Success message
 * @param {number} statusCode - HTTP status code
 */
const successResponse = (res, data = null, message = 'Success', statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
    error: null,
    timestamp: new Date().toISOString(),
  });
};

/**
 * Created Response (201)
 */
const createdResponse = (res, data = null, message = 'Created successfully') => {
  return successResponse(res, data, message, 201);
};

/**
 * No Content Response (204)
 */
const noContentResponse = (res) => {
  return res.status(204).send();
};

/**
 * Error Response
 * @param {Object} res - Express response object
 * @param {string} message - Error message
 * @param {number} statusCode - HTTP status code
 * @param {Object} errors - Validation errors
 */
const errorResponse = (res, message = 'Error', statusCode = 500, errors = null) => {
  return res.status(statusCode).json({
    success: false,
    message,
    data: null,
    error: {
      message,
      errors,
      statusCode,
    },
    timestamp: new Date().toISOString(),
  });
};

/**
 * Paginated Response
 * @param {Object} res - Express response object
 * @param {Array} data - Array of items
 * @param {Object} pagination - Pagination info
 * @param {string} message - Success message
 */
const paginatedResponse = (res, data, pagination, message = 'Success') => {
  return res.status(200).json({
    success: true,
    message,
    data,
    pagination: {
      currentPage: pagination.page,
      totalPages: pagination.totalPages,
      totalItems: pagination.totalItems,
      itemsPerPage: pagination.limit,
      hasNextPage: pagination.page < pagination.totalPages,
      hasPrevPage: pagination.page > 1,
    },
    error: null,
    timestamp: new Date().toISOString(),
  });
};

module.exports = {
  successResponse,
  createdResponse,
  noContentResponse,
  errorResponse,
  paginatedResponse,
};
