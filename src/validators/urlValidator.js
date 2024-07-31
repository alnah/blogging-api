const validator = require("validator");

const urlValidator = {
  validator: validator.isURL,
  message: "Please enter a valid URL.",
};

module.exports = urlValidator;
