const { ERROR_MESSAGES: ERR } = require("../constants");
const { BadRequestError, UnauthenticatedError } = require("../errors");

const determineUserRole = async ({ User }) => {
  const numberOfDocuments = await User.countDocuments({});
  const isFirstUser = numberOfDocuments === 0;

  if (isFirstUser) {
    return "admin";
  }
  return "user";
};

const ensureUserCredentialsDoesNotExist = async ({
  User,
  username = "",
  email = "",
  message,
}) => {
  let existingUser;

  if (username && email) {
    existingUser = await User.findOne({ $or: [{ email }, { username }] });
  } else if (username) {
    existingUser = await User.findOne({ username });
  } else if (email) {
    existingUser = await User.findOne({ email });
  }

  if (existingUser) {
    throw new BadRequestError(message);
  }
};

const ensureUserCredentialsExist = async ({
  User,
  username = "",
  email = "",
  message,
  checkForIsVerified = false,
}) => {
  let existingUser;

  if (username) {
    existingUser = await User.findOne({ username });
  } else if (email) {
    existingUser = await User.findOne({ email });
  }

  const notExistingUser = !existingUser;
  if (notExistingUser) {
    throw new BadRequestError(message);
  }

  if (checkForIsVerified && !existingUser.isVerified) {
    throw new UnauthenticatedError(ERR.ACCOUNT_NOT_VERIFIED);
  }
  return existingUser;
};

const handleFieldUpdate = ({ body, fieldName, unsetData, updateData }) => {
  if (body[fieldName] !== undefined) {
    if (body[fieldName] === null) {
      // eslint-disable-next-line no-param-reassign
      unsetData[fieldName] = ""; // for $unset
    } else {
      // eslint-disable-next-line no-param-reassign
      updateData[fieldName] = body[fieldName]; // for $set
    }
  }
};

module.exports = {
  determineUserRole,
  ensureUserCredentialsDoesNotExist,
  ensureUserCredentialsExist,
  handleFieldUpdate,
};
