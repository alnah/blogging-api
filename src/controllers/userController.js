const fs = require("fs");
const { StatusCodes: SC } = require("http-status-codes");
const {
  SELECT_FIELDS: SF,
  ERROR_MESSAGES: ERR,
  RESPONSE_MESSAGES: RES,
  ONE_MB: SIZE_LIMIT,
  ONE_MB,
} = require("../constants");
const { BadRequestError } = require("../errors");
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
const { AVATARS_DIR } = require("../constants/miscellaneousConstants");

const getAllUsers = async (req, res, next) => {
  const allUsers = await User.find({}).select(SF.EXC.PASSWORD);
  res.status(SC.OK).json({ users: allUsers, count: allUsers.length });
};

const getUser = async (req, res, next) => {
  const { id } = req.params;
  const existingUser = await User.findOne({ _id: id }).select(SF.EXC.SENSITIVE);
  if (!existingUser) {
    const message = `No user found with the provided id: "${id}". Please try again.`;
    throw new BadRequestError(message);
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
  
  //@ts-ignore
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
  //@ts-ignore
  const passwordsMatch = await existingUser.verifyPasswordsMatch({ password });
  if (!passwordsMatch) {
    throw new BadRequestError(ERR.PASSWORD_MISMATCH);
  }
  await existingUser.updateOne({ password: newPassword });

  res.status(SC.OK).json({ message: RES.PASSWORD_UPDATED });
};

const updateMyAvatar = async (req, res, next) => {
  const { id } = req.user;
  const targetPath = `${AVATARS_DIR}${id}.png`;

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

  if (req.files.avatar.size > SIZE_LIMIT) {
    throw new BadRequestError(ERR.FILE_TOO_LARGE + SIZE_LIMIT / ONE_MB + "MB");
  }

  if (!fs.existsSync(AVATARS_DIR)) {
    fs.mkdirSync(AVATARS_DIR, { recursive: true });
  }

  req.files.avatar.mv(targetPath);
  await User.findOneAndUpdate({ _id: id }, { avatar: targetPath });

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
  updateMyAvatar,
  deleteMyAccount,
};
