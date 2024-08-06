const { StatusCodes: SC } = require("http-status-codes");
const { ERROR_MESSAGES: ERR, RESPONSE_MESSAGES: RES } = require("../constants");
const { UnauthenticatedError } = require("../errors");
const { User, Token } = require("../models");
const {
  validateRequestValue,
  validateRequestValues,
  validateStrongPassword,
  validateEitherUsernameOrEmail,
} = require("../validators");
const {
  createToken,
  createRefreshToken,
  detachCookies,
  determineUserRole,
  ensureUserCredentialsDoesNotExist,
  ensureUserCredentialsExist,
  getOriginUrl,
  handleExistingRefreshToken,
  sendResetPasswordEmail,
  sendEmailVerification,
  verifyResetPasswordEmailNotAlreadySent,
  verifyResetPasswordLinkNotExpired,
  verifyTokensMatch,
} = require("../utils");

const signUp = async (req, res, next) => {
  const { username, email, password } = req.body;

  validateRequestValues({
    requiredRequestValues: [
      { value: username, message: ERR.USERNAME_REQUIRED },
      { value: email, message: ERR.EMAIL_REQUIRED },
      { value: password, message: ERR.PASSWORD_REQUIRED },
    ],
  });

  await ensureUserCredentialsDoesNotExist({
    User,
    username,
    message: ERR.USERNAME_ALREADY_USED,
  });

  await ensureUserCredentialsDoesNotExist({
    User,
    email,
    message: ERR.EMAIL_ALREADY_USED,
  });

  validateStrongPassword({ password });

  const verificationToken = createToken();
  await User.create({
    username,
    email,
    password,
    role: await determineUserRole({ User }),
    verificationToken,
  });

  const origin = getOriginUrl();
  sendEmailVerification({ origin, verificationToken, email, username });

  res.status(SC.CREATED).json({ message: RES.SIGNED_UP });
};

const verifyEmail = async (req, res, next) => {
  const { verificationToken, email } = req.body;

  validateRequestValues({
    requiredRequestValues: [
      { value: verificationToken, message: ERR.VERIFICATION_TOKEN_REQUIRED },
      { value: email, message: ERR.EMAIL_REQUIRED },
    ],
  });

  const existingUser = await ensureUserCredentialsExist({
    User,
    email,
    message: ERR.USER_NOT_FOUND,
  });

  await verifyTokensMatch({
    dbToken: existingUser.verificationToken,
    reqToken: verificationToken,
    message: ERR.VERIFICATION_TOKEN_INVALID,
  });

  await existingUser.updateOne(
    {
      isVerified: true,
      verified: Date.now(),
      verificationToken: null,
    },
    { new: true, runValidators: true }
  );

  res.status(SC.OK).json({ message: RES.EMAIL_VERIFIED });
};

const login = async (req, res, next) => {
  const { username, email, password } = req.body;

  validateEitherUsernameOrEmail({ username, email });
  validateRequestValue({
    value: password,
    message: ERR.PASSWORD_REQUIRED,
  });

  const existingUser = await ensureUserCredentialsExist({
    User,
    email,
    username,
    checkForIsVerified: true,
    message: ERR.INVALID_CREDENTIALS,
  });

  const passwordsMatch = await existingUser.verifyPasswordsMatch({ password });
  if (!passwordsMatch) {
    throw new UnauthenticatedError(ERR.PASSWORD_MISMATCH);
  }

  const existingToken = await Token.findOne({ user: existingUser._id });
  if (existingToken) {
    handleExistingRefreshToken({ Token, res, existingUser, existingToken });
    res.status(SC.OK).json({ user: existingUser });
    return;
  }
  await createRefreshToken({ Token, req, res, existingUser });

  res.status(SC.OK).json({ user: existingUser });
};

const logout = async (req, res, next) => {
  const { id } = req.user;

  await Token.findOneAndDelete({ userId: id });
  detachCookies({ res });

  res.status(SC.OK).json({ message: RES.LOGGED_OUT });
};

const forgotPassword = async (req, res, next) => {
  const { email } = req.body;

  validateRequestValue({ value: email, message: ERR.EMAIL_REQUIRED });

  const existingUser = await ensureUserCredentialsExist({
    User,
    email,
    message: ERR.USER_NOT_FOUND,
  });

  verifyResetPasswordEmailNotAlreadySent({
    resetPasswordTokenExpirationDate: existingUser,
  });

  const resetPasswordToken = createToken();
  sendResetPasswordEmail({
    email,
    resetPasswordToken,
    origin: getOriginUrl(),
    username: existingUser.username,
  });

  await existingUser.updateOne(
    { resetPasswordToken },
    { new: true, runValidators: true }
  );

  res.status(SC.OK).json({ message: RES.RESET_PASSWORD_INSTRUCTIONS });
};

const resetPassword = async (req, res, next) => {
  const { resetPasswordToken, email, password } = req.body;

  validateRequestValues({
    requiredRequestValues: [
      { value: resetPasswordToken, message: ERR.RESET_PASSWORD_TOKEN_REQUIRED },
      { value: email, message: ERR.EMAIL_REQUIRED },
      { value: password, message: ERR.PASSWORD_REQUIRED },
    ],
  });

  const existingUser = await ensureUserCredentialsExist({
    User,
    email,
    message: ERR.USER_NOT_FOUND,
  });

  verifyResetPasswordLinkNotExpired({
    resetPasswordTokenExpirationDate:
      existingUser.resetPasswordTokenExpirationDate,
  });

  await verifyTokensMatch({
    dbToken: existingUser.resetPasswordToken,
    reqToken: resetPasswordToken,
    message: ERR.RESET_PASSWORD_TOKEN_REQUIRED,
  });

  await existingUser.updateOne(
    {
      password,
      resetPasswordToken: null,
      resetPasswordTokenExpirationDate: null,
    },
    { new: true, runValidators: true }
  );

  res.status(SC.OK).json({ message: RES.RESET_PASSWORD });
};

module.exports = {
  signUp,
  login,
  logout,
  verifyEmail,
  forgotPassword,
  resetPassword,
};
