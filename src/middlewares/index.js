const {
  authenticateUser,
  authorizeRoles,
} = require("./authenticationMiddleware");
const { cookieParser } = require("./parserMiddleware");
const { jsonParser } = require("./parserMiddleware");
const errorHandler = require("./errorHandlerMiddleware");
const imageUploader = require("./imageUploaderMiddleware");
const httpRequestsLogger = require("./httpRequestsLoggerMiddleware");
const routeNotFound = require("./routeNotFoundMiddleware");

module.exports = {
  authenticateUser,
  authorizeRoles,
  cookieParser,
  jsonParser,
  errorHandler,
  imageUploader,
  httpRequestsLogger,
  routeNotFound,
};
