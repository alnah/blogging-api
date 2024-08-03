const crypto = require("crypto");
const { UnauthenticatedError } = require("../errors");
const { validateToken } = require("../validators");
const { hashToken } = require("./hashingUtil");
const { attachCookies } = require("./cookiesUtil");

const createToken = () => {
  const bytes = Number(process.env.BYTES);
  return crypto.randomBytes(bytes).toString("hex");
};

const verifyTokensMatch = async ({ dbToken, reqToken, message }) => {
  const hashedToken = await hashToken({ token: reqToken });
  const tokensMatch = dbToken === hashedToken;

  if (!tokensMatch) {
    throw new UnauthenticatedError(message);
  }
};

const handleExistingRefreshToken = ({
  Token,
  res,
  existingUser,
  existingToken,
}) => {
  validateToken({ existingToken });

  const refreshToken = existingToken.refreshToken;
  const userRef = Token.createUserRef({ existingUser });

  attachCookies({ res, user: userRef, refreshToken });
};

const createRefreshToken = async ({ Token, req, res, existingUser }) => {
  const refreshToken = createToken();
  const tokenDoc = {
    refreshToken,
    ipAddress: req.ip,
    userAgent: req.headers["user-agent"],
    userId: existingUser._id,
  };

  await Token.create(tokenDoc);
  const userRef = Token.createUserRef({ existingUser });

  attachCookies({ res, user: userRef, refreshToken });
};

module.exports = {
  createToken,
  verifyTokensMatch,
  handleExistingRefreshToken,
  createRefreshToken,
};
