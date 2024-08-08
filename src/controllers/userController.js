const fs = require("fs");
const { StatusCodes: SC } = require("http-status-codes");
const {
  ERROR_MESSAGES: ERR,
  ENVIRONMENT: ENV,
  MISCELLANEOUS: MISC,
  SELECT_FIELDS: SF,
  RESPONSE_MESSAGES: RES,
} = require("../constants");
const { BadRequestError, NotFoundError } = require("../errors");
const { User } = require("../models");
const {
  validateRequestValues,
  validateStrongPassword,
  validateRequestValue,
} = require("../validators");
const {
  createToken,
  getOriginUrl,
  ensureUserCredentialsDoesNotExist,
  sendNewEmailVerification,
  attachCookies,
  handleFieldUpdate,
} = require("../utils");

const getAllUsers = async (req, res, next) => {
  const allUsers = await User.find({}).select(SF.EXC.PASSWORD);
  res.status(SC.OK).json({ users: allUsers, count: allUsers.length });
};

const getUser = async (req, res, next) => {
  const { id } = req.params;
  const existingUser = await User.findOne({ _id: id }).select(SF.EXC.SENSITIVE);
  if (!existingUser) {
    const message = `No user found with the provided id: "${id}". Please try again.`;
    throw new NotFoundError(message);
  }

  res.status(SC.OK).json({ user: existingUser });
};

const showMyAccount = async (req, res, next) => {
  const { id } = req.user;
  const existingUser = await User.findOne({ _id: id }).select(SF.EXC.SENSITIVE);
  res.status(SC.OK).json({ user: existingUser });
};

const updateMyProfile = async (req, res, next) => {
  const updateData = {};
  const unsetData = {};
  const {
    body,
    user: { id },
  } = req;

  // @ts-ignore
  const fields = User.getFieldsForUpdate();
  fields.forEach((fieldName) =>
    handleFieldUpdate({ body, fieldName, unsetData, updateData })
  );

  const updatedUser = await User.findOneAndUpdate(
    { _id: id },
    { $set: updateData, $unset: unsetData },
    { new: true, runValidators: true }
  ).select(SF.EXC.SENSITIVE);

  res.status(SC.OK).json({ user: updatedUser });
};

const updateMyUsername = async (req, res, next) => {
  const {
    body: { newUsername },
    user: { id },
  } = req;

  validateRequestValue({
    value: newUsername,
    message: ERR.NEW_USERNAME_REQUIRED,
  });

  await ensureUserCredentialsDoesNotExist({
    User,
    username: newUsername,
    message: ERR.USERNAME_ALREADY_USED,
  });

  await User.findOneAndUpdate(
    { _id: id },
    { username: newUsername },
    { new: true, runValidators: true }
  );

  attachCookies({ res, user: { ...req.user, username: newUsername } });
  res.status(SC.OK).json({ message: RES.USERNAME_UPDATED });
};

const updateMyEmail = async (req, res, next) => {
  const {
    body: { newEmail },
    user: { id, username },
  } = req;

  validateRequestValue({ value: newEmail, message: ERR.NEW_EMAIL_REQUIRED });

  await ensureUserCredentialsDoesNotExist({
    User,
    email: newEmail,
    message: ERR.EMAIL_ALREADY_USED,
  });

  const verificationToken = createToken();
  await User.findOneAndUpdate(
    { _id: id },
    { email: newEmail, isVerified: false, verificationToken },
    { new: true, runValidators: true }
  );

  const origin = getOriginUrl();
  await sendNewEmailVerification({
    origin,
    verificationToken,
    email: newEmail,
    username,
  });

  res.status(SC.OK).json({ message: RES.EMAIL_UPDATED });
};

const updateMyPassword = async (req, res, next) => {
  const {
    body: { password, newPassword },
    user: { id },
  } = req;

  validateRequestValues({
    requiredRequestValues: [
      { value: password, message: ERR.PASSWORD_REQUIRED },
      { value: newPassword, message: ERR.NEW_PASSWORD_REQUIRED },
    ],
  });

  validateStrongPassword({ password: newPassword });

  const existingUser = await User.findOne({ _id: id }).select(SF.INC.PASSWORD);
  // @ts-ignore
  const passwordsMatch = await existingUser.verifyPasswordsMatch({ password });
  if (!passwordsMatch) {
    throw new BadRequestError(ERR.PASSWORD_MISMATCH);
  }
  await existingUser.updateOne({ password: newPassword });

  res.status(SC.OK).json({ message: RES.PASSWORD_UPDATED });
};

const uploadMyAvatar = async (req, res, next) => {
  const { id, username } = req.user;
  const targetPath = `${MISC.AVATARS_DIR}${id}.png`;

  if (!req.files || !req.files.avatar) {
    throw new BadRequestError(ERR.NO_FILE_UPLOADED);
  }

  if (req.files.avatar.length > 1) {
    throw new BadRequestError(ERR.MULTIPLE_IMAGES_NOT_ALLOWED);
  }

  const { mimetype } = req.files.avatar;
  if (!mimetype.startsWith("image/")) {
    throw new BadRequestError(ERR.IMAGE_REQUIRED);
  }

  const sizeLimit = MISC.ONE_MB;
  const errorMessage = `${ERR.FILE_TOO_LARGE + sizeLimit / MISC.ONE_MB}MB`;
  if (req.files.avatar.size > sizeLimit) {
    throw new BadRequestError(errorMessage);
  }

  if (!fs.existsSync(MISC.AVATARS_DIR)) {
    fs.mkdirSync(MISC.AVATARS_DIR, { recursive: true });
  }

  req.files.avatar.mv(targetPath);
  await User.findOneAndUpdate(
    { _id: id },
    {
      avatarUrl:
        ENV.IS_DEV || ENV.IS_TEST
          ? `${process.env.ORIGIN_DEV}/@${username}/avatar`
          : `${process.env.ORIGIN_PROD}/@${username}/avatar`,
    }
  );

  res.status(SC.OK).json({ image: { src: targetPath } });
};

const deleteMyAccount = async (req, res, next) => {
  const { id } = req.user;
  await User.findOneAndDelete({ _id: id });
  res.status(SC.OK).json({ message: RES.DELETED_ACCOUNT });
};

module.exports = {
  getAllUsers,
  getUser,
  showMyAccount,
  updateMyProfile,
  updateMyUsername,
  updateMyEmail,
  updateMyPassword,
  uploadMyAvatar,
  deleteMyAccount,
};
