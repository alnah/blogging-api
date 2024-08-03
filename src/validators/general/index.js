const validateStrongPassword = require("./passwordValidator");
const validateToken = require("./tokenValidator");
const {
  validateRequestValue,
  validateRequestValues,
  validateEitherUsernameOrEmail,
} = require("./requestValuesValidator");

module.exports = {
  validateStrongPassword,
  validateToken,
  validateEitherUsernameOrEmail,
  validateRequestValue,
  validateRequestValues,
};
