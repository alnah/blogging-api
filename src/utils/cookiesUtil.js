const { ENV } = require("../constants");
const { createJsonWebToken } = require("./jsonWebTokenUtil");

const attachCookies = ({ res, user, refreshToken }) => {
  const accessTokenJWT = createJsonWebToken({ payload: { user } });
  const refreshTokenJWT = createJsonWebToken({
    payload: { user, refreshToken },
  });

  res.cookie("accessToken", accessTokenJWT, {
    httpOnly: true,
    expires: new Date(Date.now() + Number(process.env.ACCESS_TOKEN_LIFETIME)),
    secure: ENV.IS_PROD,
    signed: true,
    sameSite: "Strict",
  });

  res.cookie("refreshToken", refreshTokenJWT, {
    httpOnly: true,
    expires: new Date(Date.now() + Number(process.env.REFRESH_TOKEN_LIFETIME)),
    secure: ENV.IS_PROD,
    signed: true,
    sameSite: "Strict",
  });
};

const detachCookies = ({ res }) => {
  res.cookie("accessToken", null, {
    httpOnly: true,
    expires: new Date(0),
    secure: ENV.IS_PROD,
    signed: true,
    sameSite: "Strict",
  });

  res.cookie("refreshToken", null, {
    httpOnly: true,
    expires: new Date(0),
    secure: ENV.IS_PROD,
    signed: true,
    sameSite: "Strict",
  });
};

module.exports = { attachCookies, detachCookies };
