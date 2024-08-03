const getOriginUrl = () => {
  return process.env.NODE_ENV === "development"
    ? process.env.ORIGIN_DEV
    : process.env.ORIGIN_PROD;
};

module.exports = getOriginUrl;
