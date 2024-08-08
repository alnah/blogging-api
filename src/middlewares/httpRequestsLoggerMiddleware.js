const morgan = require("morgan");
const { ENVIRONMENT: ENV } = require("../constants");

const httpRequestsLogger = () => {
  if (ENV.IS_DEV) {
    return morgan("tiny");
  } else {
    return (req, res, next) => next();
  }
};

module.exports = httpRequestsLogger;