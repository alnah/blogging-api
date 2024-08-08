const { attachCookies, detachCookies } = require("./cookiesUtil");
const {
  createJsonWebToken,
  verifyJsonWebToken,
} = require("./jsonWebTokenUtil");
const {
  createRefreshToken,
  handleExistingRefreshToken,
  createToken,
  verifyTokensMatch,
} = require("./tokensUtil");
const {
  verifyResetPasswordEmailNotAlreadySent,
  verifyResetPasswordLinkNotExpired,
} = require("./passwordUtil");
const {
  determineUserRole,
  ensureUserCredentialsDoesNotExist,
  ensureUserCredentialsExist,
  handleFieldUpdate,
} = require("./userUtil");
const getOriginUrl = require("./originUrlUtil");
const { hashPassword, hashToken } = require("./hashingUtil");
const {
  sendResetPasswordEmail,
  sendEmailVerification,
  sendNewEmailVerification,
} = require("./sendingEmailUtil");

module.exports = {
  attachCookies,
  detachCookies,
  createJsonWebToken,
  verifyJsonWebToken,
  createRefreshToken,
  handleExistingRefreshToken,
  createToken,
  verifyTokensMatch,
  verifyResetPasswordEmailNotAlreadySent,
  verifyResetPasswordLinkNotExpired,
  determineUserRole,
  ensureUserCredentialsDoesNotExist,
  ensureUserCredentialsExist,
  handleFieldUpdate,
  getOriginUrl,
  hashPassword,
  hashToken,
  sendResetPasswordEmail,
  sendEmailVerification,
  sendNewEmailVerification,
};
