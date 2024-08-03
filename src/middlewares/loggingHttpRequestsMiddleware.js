const morgan = require("morgan");
const { ENV } = require("../constants");

const logHttpRequests = () => {
  if (ENV.IS_DEV) {
    return morgan("tiny");
  } else {
    return (req, res, next) => next();
  }
};

module.exports = logHttpRequests;
