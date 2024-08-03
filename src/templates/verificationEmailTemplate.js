const createVerificationEmailTemplate = ({
  origin,
  verificationToken,
  email,
  username,
}) => {
  const appName = process.env.APP_NAME;

  const verifyEmailControllerLink =
    `${origin}/user/verify-email?verificationToken=` +
    `${verificationToken}&email=${email}`;

  const subject = `${appName} - Please verify your email address`;

  const html = `<p>Hi there, ${username}!</p>
  <p>Thank you for signing up for ${appName}. To complete your registration, 
  please verify your email address by clicking the link below:</p>
  <a href="${verifyEmailControllerLink}">Verify Email</a>
  <p>If you didn't create an account, please ignore this email.</p>
  <p>Best regards,<br>The ${appName} Team</p>`;

  return {
    to: email,
    subject,
    html,
  };
};

module.exports = createVerificationEmailTemplate;
