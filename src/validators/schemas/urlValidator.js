const validator = require("validator");

const urlValidator = {
  validator: (v) => validator.isURL(v),
  message: "Please enter a valid URL.",
};

module.exports = urlValidator;
