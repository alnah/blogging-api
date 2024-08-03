const validator = require("validator");

const emailValidator = {
  validator: (v) => validator.isEmail(v),
  message: "Please enter a valid email address.",
};

module.exports = emailValidator;
