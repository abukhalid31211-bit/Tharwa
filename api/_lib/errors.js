/**
 * Error handling utilities for API responses
 */

const logger = require('./logger');

class APIError extends Error {
  constructor(message, statusCode = 500, code = 'INTERNAL_ERROR') {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.name = 'APIError';
  }
}

class ValidationError extends APIError {
  constructor(message, details = null) {
    super(message, 400, 'VALIDATION_ERROR');
    this.details = details;
    this.name = 'ValidationError';
  }
}

class AuthenticationError extends APIError {
  constructor(message = 'Authentication required') {
    super(message, 401, 'AUTH_ERROR');
    this.name = 'AuthenticationError';
  }
}

class AuthorizationError extends APIError {
  constructor(message = 'Access denied') {
    super(message, 403, 'FORBIDDEN');
    this.name = 'AuthorizationError';
  }
}

class NotFoundError extends APIError {
  constructor(resource = 'Resource') {
    super(`${resource} not found`, 404, 'NOT_FOUND');
    this.name = 'NotFoundError';
  }
}

/**
 * Send error response with proper logging
 */
function sendError(res, error, requestContext = {}) {
  let statusCode = 500;
  let response = {
    success: false,
    error: {
      code: 'INTERNAL_ERROR',
      message: 'An unexpected error occurred',
    },
  };

  if (error instanceof APIError) {
    statusCode = error.statusCode;
    response.error = {
      code: error.code,
      message: error.message,
      ...(error.details && { details: error.details }),
    };
  } else if (error instanceof Error) {
    // Generic error
    response.error.message = error.message;
  }

  // Log the error
  logger.error('API Error', error, {
    statusCode,
    requestContext,
  });

  return res.status(statusCode).json(response);
}

/**
 * Send success response
 */
function sendSuccess(res, data, statusCode = 200) {
  return res.status(statusCode).json({
    success: true,
    data,
  });
}

/**
 * Validate required environment variables
 */
function validateEnv(requiredVars) {
  const missing = [];
  requiredVars.forEach((varName) => {
    if (!process.env[varName]) {
      missing.push(varName);
    }
  });

  if (missing.length > 0) {
    const error = new APIError(
      `Missing environment variables: ${missing.join(', ')}`,
      500,
      'ENV_CONFIG_ERROR'
    );
    logger.error('Environment validation failed', error, { missing });
    throw error;
  }
}

module.exports = {
  APIError,
  ValidationError,
  AuthenticationError,
  AuthorizationError,
  NotFoundError,
  sendError,
  sendSuccess,
  validateEnv,
};
