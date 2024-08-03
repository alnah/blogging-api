const createResetPasswordEmailTemplate = ({
  origin,
  resetPasswordToken,
  email,
  username,
}) => {
  const appName = process.env.APP_NAME;

  const resetPasswordLink =
    `${origin}/user/reset-password?resetPasswordToken=` +
    `${resetPasswordToken}&email=${email}`;

  const subject = `${appName} - Reset your password`;

  const html = `<p>Hi there, ${username}!</p>
  <p>We received a request to reset your password for your account at 
  ${appName}. You can reset your password by clicking the link below:</p>
  <a href="${resetPasswordLink}">Reset Password</a>
  <p>If you didn't request a password reset, please ignore this email.</p>
  <p>Best regards,<br>The ${appName} Team</p>`;

  return {
    to: email,
    subject,
    html,
  };
};

module.exports = createResetPasswordEmailTemplate;
