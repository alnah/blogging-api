const ERROR_MESSAGES = {
  ACCOUNT_NOT_VERIFIED:
    "Your account has not been verified yet. " +
    "Please check your email for the verification link.",

  EMAIL_ALREADY_USED:
    "This email is already in use. Please try a different one.",

  EMAIL_REQUIRED: "Email address is required. Please enter your email.",

  INVALID_CREDENTIALS:
    "The credentials you entered are incorrect. Please check and try again.",

  PASSWORD_MISMATCH: "The passwords do not match. Please try again.",

  PASSWORD_REQUIRED: "Password is required. Please enter your password.",

  PASSWORD_WEAK:
    "Your password must be at least 8 characters long, " +
    "and include at least one uppercase letter, one lowercase letter, " +
    "one number, and one special character.",

  RESET_PASSWORD_EMAIL_ALREADY_SENT:
    "A reset password link has already been sent. " +
    "Please check your email or try again in a few minutes.",

  RESET_PASSWORD_LINK_EXPIRED:
    "Your reset password link has expired. Please request a new one.",

  RESET_PASSWORD_TOKEN_REQUIRED:
    "A reset password token is required to reset your password.",

  USERNAME_ALREADY_USED:
    "This username is already in use. Please choose a different one.",

  USERNAME_REQUIRED: "Username is required. Please enter your username.",

  USER_NOT_FOUND:
    "No user found with the provided email. Please verify and try again.",

  USER_OR_EMAIL_REQUIRED:
    "Please provide either a username or an email address to continue.",

  USER_TOKEN_INVALID:
    "The user token provided is invalid. Please log in again.",

  VERIFICATION_TOKEN_REQUIRED:
    "A verification token is required to verify your email address.",

  VERIFICATION_TOKEN_INVALID:
    "The verification token is invalid. Please check and try again.",
};

module.exports = ERROR_MESSAGES;
