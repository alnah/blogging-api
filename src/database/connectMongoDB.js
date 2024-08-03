const mongoose = require("mongoose");
const { ENV } = require("../constants");

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
      throw new Error("NODE_ENV is not set to a valid environment.");
  }

  await mongoose.connect(uriString);
  console.log(`Connected to MongoDB in '${ENV.NODE}' environment.`);
};

module.exports = connectMongoDB;
