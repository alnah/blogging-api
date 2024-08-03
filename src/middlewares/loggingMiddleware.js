const morgan = require("morgan");

const loggingHttpRequests = () => {
  if (process.env.NODE_ENV === "development") {
    return morgan("tiny");
  } else {
    return (req, res, next) => next();
  }
};

module.exports = loggingHttpRequests;
