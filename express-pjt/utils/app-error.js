// src/utils/app-error.js

function createAppError(errorInfo) {
  const error = new Error(errorInfo.message);
  error.code = errorInfo.code;
  error.status = errorInfo.status;
  return error;
}

module.exports = { createAppError };
