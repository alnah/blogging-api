const { ERROR_MESSAGES: ERR } = require("../../constants");
const { UnauthenticatedError } = require("../../errors");

const validateToken = ({ existingToken }) => {
  const { isValid } = existingToken;
  const notValidToken = !isValid;

  if (notValidToken) {
    throw new UnauthenticatedError(ERR.USER_TOKEN_INVALID);
  }
};

module.exports = validateToken;
