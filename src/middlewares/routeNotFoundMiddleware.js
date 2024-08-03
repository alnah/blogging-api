const { StatusCodes } = require("http-status-codes");
const { ERROR_MESSAGES: ERR } = require("../constants");

const routeNotFound = (_, res) => {
  res
    .status(StatusCodes.NOT_FOUND)
    .json({ message: ERR.ROUTE_NOT_FOUND });
};

module.exports = routeNotFound;
