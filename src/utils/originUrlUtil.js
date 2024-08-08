const { ENVIRONMENT: ENV } = require("../constants");

const getOriginUrl = () => {
  return ENV.IS_DEV ? process.env.ORIGIN_DEV : process.env.ORIGIN_PROD;
};

module.exports = getOriginUrl;
