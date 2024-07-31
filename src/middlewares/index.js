const errorHandlerMiddleware = require("./errorHandlerMiddleware");
const routeNotFoundMiddleware = require("./routeNotFoundMiddleware");
const loggingMiddleware = require("./loggingMiddleware");
const jsonParserMiddleware = require("./jsonParserMiddleware");

module.exports = {
  errorHandlerMiddleware,
  routeNotFoundMiddleware,
  loggingMiddleware,
  jsonParserMiddleware,
};
