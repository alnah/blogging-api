const { isStrongPassword } = require("validator");
const { ERROR_MESSAGES: ERR } = require("../../constants");
const { BadRequestError } = require("../../errors");

const validateStrongPassword = ({ password }) => {
  const weakPassword = !isStrongPassword(password);

  if (weakPassword) {
    throw new BadRequestError(ERR.PASSWORD_WEAK);
  }
};

module.exports = validateStrongPassword;
