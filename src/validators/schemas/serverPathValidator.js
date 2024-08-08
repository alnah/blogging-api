const { ENVIRONMENT: ENV } = require("../../constants");

const serverPath =
  ENV.IS_DEV || ENV.IS_TEST ? process.env.ORIGIN_DEV : process.env.ORIGIN_PROD;

const serverPathValidator = {
  validator: (v) => v.startsWith(`${serverPath}`),
  message: (props) =>
    `${props.value} is not a valid path. It should start with ${serverPath}`,
};

module.exports = serverPathValidator;
