const mongoose = require("mongoose");
const NODE_ENV = process.env.NODE_ENV;

const connectMongoDB = async () => {
  let uriString;

  switch (NODE_ENV) {
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
  console.log(`Connected to MongoDB in '${NODE_ENV}' environment.`);
};

module.exports = connectMongoDB;
