const { ERROR_MESSAGES: ERR } = require("../../constants");
const { BadRequestError } = require("../../errors");

const validateRequestValue = ({ value, message }) => {
  if (!value) {
    throw new BadRequestError(message);
  }
};

const validateRequestValues = ({ requiredRequestValues }) => {
  requiredRequestValues.forEach(({ value, message }) =>
    validateRequestValue({ value, message }),
  );
};

const validateEitherUsernameOrEmail = ({ username, email }) => {
  if (!username && !email) {
    throw new BadRequestError(ERR.USER_OR_EMAIL_REQUIRED);
  }
};

module.exports = {
  validateRequestValue,
  validateRequestValues,
  validateEitherUsernameOrEmail,
};
