const { constants } = require("../constants");

const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || res.statusCode || constants.SERVER_ERROR;

  let response;

  switch (statusCode) {
    case constants.VALIDATION_ERROR:
      response = {
        title: "Validation failed",
        message: err.message || "Validation error",
        stackTrace: err.stack || null,
      };
      break;
    case constants.NOT_FOUND:
      response = {
        title: "Not Found",
        message: err.message || "Resource not found",
        stackTrace: err.stack || null,
      };
      break;
    case constants.UNAUTHORIZED:
      response = {
        title: "Unauthorized",
        message: err.message || "Unauthorized access",
        stackTrace: err.stack || null,
      };
      break;
    case constants.FORBIDDEN:
      response = {
        title: "Forbidden error",
        message: err.message || "Forbidden access",
        stackTrace: err.stack || null,
      };
      break;
    case constants.SERVER_ERROR:
    default:
      response = {
        title: "Internal Server Error",
        message: err.message || "An unexpected error occurred",
        stackTrace: err.stack || null,
      };
      break;
  }
  console.error("Error caught by errorHandler:", err);

  res.status(statusCode).json(response);
};

module.exports = errorHandler;
