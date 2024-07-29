const CustomAPIError = require("./CustomAPIError");
const NotFoundError = require("./NotFoundError");
const BadRequestError = require("./BadRequestError");
const UnauthenticatedError = require("./UnauthenticatedError");
const UnauthorizedError = require("./UnauthorizedError");

module.exports = {
  CustomAPIError,
  NotFoundError,
  BadRequestError,
  UnauthenticatedError,
  UnauthorizedError,
};
