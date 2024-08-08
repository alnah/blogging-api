const ERROR_MESSAGES = {
  ACCOUNT_NOT_VERIFIED:
    "Your account isn't verified. Please check your email for the link.",
  EMAIL_ALREADY_USED:
    "This email is already in use. Please choose a different one.",
  EMAIL_INVALID:
    "The email address you entered is invalid. Please double-check it.",
  EMAIL_REQUIRED: "Please enter your email address.",
  FILE_TOO_LARGE: "The uploaded file is too large. Please reduce its size.",
  IMAGE_REQUIRED: "Please upload an image file.",
  INVALID_CREDENTIALS:
    "The credentials you entered are incorrect. Please try again.",
  IP_ADDRESS_REQUIRED: "Please provide your IP address.",
  MAX_FILES_EXCEEDED: "You have exceeded the maximum number of files allowed. " +
    "Please reduce the number of files to 5 and try again.",
  MULTIPLE_IMAGES_NOT_ALLOWED: "Only one image can be uploaded at a time.",
  NEW_EMAIL_REQUIRED: "Please enter your new email address.",
  NEW_PASSWORD_REQUIRED: "Please enter a new password to continue.",
  NEW_USERNAME_REQUIRED: "Please enter your new username.",
  NODE_ENV: "NODE_ENV is not set to a valid environment.",
  NO_FILE_UPLOADED: "No file was uploaded. Please upload a file.",
  PASSWORD_MISMATCH: "The passwords do not match. Please try again.",
  PASSWORD_REQUIRED: "Please enter your password.",
  PASSWORD_WEAK:
    "Your password must be at least 8 characters long, including one " +
    "uppercase letter, one lowercase letter, one number, and one special " +
    "character.",
  POST_ALREADY_EXISTS: "A post with the same title and content already exists.",
  POST_NOT_FOUND: "The requested post could not be found. Please check the ID.",
  REFRESH_TOKEN_REQUIRED: "Please provide a refresh token.",
  RESET_PASSWORD_EMAIL_ALREADY_SENT:
    "A reset password link has already been sent. Please check your email.",
  RESET_PASSWORD_LINK_EXPIRED:
    "Your reset password link has expired. Please request a new one.",
  RESET_PASSWORD_TOKEN_REQUIRED:
    "A reset password token is required to reset your password.",
  ROUTE_NOT_FOUND:
    "The requested route could not be found. Please check the URL.",
  SOMETHING_WENT_WRONG: "Oops! Something went wrong. Please try again later.",
  URL_INVALID: "The URL you entered is invalid. Please check it.",
  USER_AGENT_REQUIRED: "Please provide your user agent.",
  USER_NOT_FOUND:
    "No user found with the provided email. Please verify and try again.",
  USER_OR_EMAIL_REQUIRED:
    "Please provide either a username or an email address to continue.",
  USER_REFERENCE_REQUIRED: "Please provide your user reference.",
  USERNAME_ALREADY_USED:
    "This username is already in use. Please choose a different one.",
  USERNAME_REQUIRED: "Please enter your username.",
  VERIFICATION_TOKEN_INVALID:
    "The verification token is invalid. Please check and try again.",
  VERIFICATION_TOKEN_REQUIRED:
    "A verification token is required to verify your email address.",
  USER_TOKEN_INVALID:
    "The user token provided is invalid. Please log in again.",
};

module.exports = ERROR_MESSAGES;
