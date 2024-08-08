const mongoose = require("mongoose");
const { ENVIRONMENT: ENV, ERROR_MESSAGES: ERR } = require("../constants");

const connectMongoDB = async () => {
  let uriString;

  switch (ENV.NODE) {
    case "development":
      uriString = process.env.MONGODB_DEV;
      break;
    case "test":
      uriString = process.env.MONGODB_TEST;
      break;
    case "production":
      uriString = process.env.MONGODB_PROD;
      break;
    default:
      throw new Error(ERR.NODE_ENV);
  }

  await mongoose.connect(uriString);
  console.log(`Connected to MongoDB in '${ENV.NODE}' environment.`);
};

module.exports = connectMongoDB;
