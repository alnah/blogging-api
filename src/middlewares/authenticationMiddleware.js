const { StatusCodes: SC } = require("http-status-codes");
const { ERROR_MESSAGES: ERR } = require("../constants");
const { UnauthenticatedError, UnauthorizedError } = require("../errors");
const { Token } = require("../models");
const { verifyJsonWebToken, attachCookies } = require("../utils");

const authenticateUser = async (req, res, next) => {
  const { refreshToken, accessToken } = req.signedCookies;

  if (accessToken) {
    const payload = verifyJsonWebToken({ token: accessToken });

    if (typeof payload === "object" && payload !== null) {
      req.user = payload.user;
      return next();
    }
  }

  if (refreshToken) {
    const payload = verifyJsonWebToken({ token: refreshToken });

    if (typeof payload === "object" && payload !== null) {
      const existingToken = await Token.findOne({
        userId: payload.user.id,
        refreshToken: payload.refreshToken,
      });

      if (!existingToken || !existingToken?.isValid) {
        throw new UnauthenticatedError(ERR.USER_TOKEN_INVALID);
      }

      attachCookies({
        res,
        user: payload.user,
        refreshToken: existingToken.refreshToken,
      });

      res.status(SC.OK).json({ user: payload.user });
      return next();
    }
  }
  return next();
};

const authorizeRoles = ([...roles]) => {
  return async (req, rest, next) => {
    if (!roles.includes(req.user.role)) {
      throw new UnauthorizedError(
        `Only '${roles.join(", ")}' users can access this resource.`
      );
    }
    next();
  };
};

module.exports = { authenticateUser, authorizeRoles };
