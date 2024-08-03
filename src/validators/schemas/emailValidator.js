const validator = require("validator");
const { ERROR_MESSAGES: ERR } = require("../../constants");

const emailValidator = {
  validator: (v) => validator.isEmail(v),
  message: ERR.EMAIL_INVALID,
};

module.exports = emailValidator;
