const validator = require("validator");
const { ERROR_MESSAGES: ERR } = require("../../constants");

const urlValidator = {
  validator: (v) => validator.isURL(v),
  message: ERR.URL_INVALID,
};

module.exports = urlValidator;
