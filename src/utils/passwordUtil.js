const { ERROR_MESSAGES: ERR } = require("../constants");
const { BadRequestError } = require("../errors");

const verifyResetPasswordEmailNotAlreadySent = ({
  resetPasswordTokenExpirationDate,
}) => {
  const currentDate = new Date();
  if (
    resetPasswordTokenExpirationDate &&
    currentDate < resetPasswordTokenExpirationDate
  ) {
    throw new BadRequestError(ERR.RESET_PASSWORD_EMAIL_ALREADY_SENT);
  }
};

const verifyResetPasswordLinkNotExpired = ({
  resetPasswordTokenExpirationDate,
}) => {
  const currentDate = new Date();
  if (currentDate > resetPasswordTokenExpirationDate) {
    throw new BadRequestError(ERR.RESET_PASSWORD_LINK_EXPIRED);
  }
};

module.exports = {
  verifyResetPasswordEmailNotAlreadySent,
  verifyResetPasswordLinkNotExpired,
};
