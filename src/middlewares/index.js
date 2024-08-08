const {
  authenticateUser,
  authorizeRoles,
} = require("./authenticationMiddleware");
const cookieParser = require("./parserMiddleware").cookieParser;
const jsonParser = require("./parserMiddleware").jsonParser;
const errorHandler = require("./errorHandlerMiddleware");
const imageUploader = require("./imageUploaderMiddleware");
const logHttpRequests = require("./loggingHttpRequestsMiddleware");
const routeNotFound = require("./routeNotFoundMiddleware");

module.exports = {
  authenticateUser,
  authorizeRoles,
  cookieParser,
  jsonParser,
  errorHandler,
  imageUploader,
  logHttpRequests,
  routeNotFound,
};
