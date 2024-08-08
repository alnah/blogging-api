const ENVIRONMENT = {
  NODE: process.env.NODE_ENV,
  IS_DEV: process.env.NODE_ENV === "development",
  IS_TEST: process.env.NODE_ENV === "test",
  IS_PROD: process.env.NODE_ENV === "production",
};

module.exports = ENVIRONMENT;
