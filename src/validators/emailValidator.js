const validator = require("validator");

const emailValidator = {
  validator: validator.isEmail,
  message: "Please enter a valid email address.",
};

module.exports = emailValidator;
