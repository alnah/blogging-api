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
  ensureUserDoesNotExist,
  ensureUserExists,
} = require("./userUtil");
const getOriginUrl = require("./originUrlUtil");
const { hashPassword, hashToken } = require("./hashingUtil");
const {
  sendResetPasswordEmail,
  sendVerificationEmail,
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
  ensureUserDoesNotExist,
  ensureUserExists,
  getOriginUrl,
  hashPassword,
  hashToken,
  sendResetPasswordEmail,
  sendVerificationEmail,
};
