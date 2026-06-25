/**
 * Structured logging utility for Vercel serverless functions
 * Logs to console which are captured by Vercel logs
 */

const LOG_LEVELS = {
  DEBUG: 'DEBUG',
  INFO: 'INFO',
  WARN: 'WARN',
  ERROR: 'ERROR',
};

function formatLog(level, message, data = null) {
  const timestamp = new Date().toISOString();
  const logEntry = {
    timestamp,
    level,
    message,
    ...(data && { data }),
  };
  return JSON.stringify(logEntry);
}

const logger = {
  debug: (message, data) => {
    console.log(formatLog(LOG_LEVELS.DEBUG, message, data));
  },
  
  info: (message, data) => {
    console.log(formatLog(LOG_LEVELS.INFO, message, data));
  },
  
  warn: (message, data) => {
    console.warn(formatLog(LOG_LEVELS.WARN, message, data));
  },
  
  error: (message, error, data) => {
    const errorData = {
      ...(error && {
        errorMessage: error.message,
        errorStack: error.stack,
        errorCode: error.code,
      }),
      ...data,
    };
    console.error(formatLog(LOG_LEVELS.ERROR, message, errorData));
  },
};

module.exports = logger;
