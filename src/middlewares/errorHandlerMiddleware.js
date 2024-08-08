const { StatusCodes } = require("http-status-codes");
const { ERROR_MESSAGES: ERR, ENVIRONMENT: ENV } = require("../constants");

const errorHandler = (err, req, res, next) => {
  const customError = {
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    message: err.message || ERR.SOMETHING_WENT_WRONG,
  };

  if (err.code && err.code === 11000) {
    customError.message =
      "Duplicate value entered " +
      `${Object.keys(err.keyValue)} field, please choose another value.`;
    customError.statusCode = StatusCodes.BAD_REQUEST;
  }

  if (err.name === "ValidationError") {
    customError.message = Object.values(err.errors)
      .map((e) => e.message)
      .join(" ");
    customError.statusCode = StatusCodes.BAD_REQUEST;
  }

  if (err.name === "CastError") {
    customError.message = `No item found with id: ${err.value}`;
    customError.statusCode = StatusCodes.NOT_FOUND;
  }

  if (ENV.IS_DEV) {
    customError.stack = err.stack;
  }

  return res
    .status(customError.statusCode)
    .json({ message: customError.message, stack: customError.stack });
};

module.exports = errorHandler;
