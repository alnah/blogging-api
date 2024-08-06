const createVerificationNewEmailTemplate = ({
  origin,
  verificationToken,
  email,
  username,
}) => {
  const appName = process.env.APP_NAME;

  const verifyEmailControllerLink =
    `${origin}/user/verify-email?verificationToken=` +
    `${verificationToken}&email=${email}`;

  const subject = `${appName} - Please verify your new email address`;

  const html = `<p>Hi there, ${username}!</p>
  <p>We noticed you updated your email address. To confirm this change, 
  please verify your new email address by clicking the link below:</p>
  <a href="${verifyEmailControllerLink}">Verify New Email</a>
  <p>If you didn't request this change, please ignore this email.</p>
  <p>Best regards,<br>The ${appName} Team</p>`;

  return {
    to: email,
    subject,
    html,
  };
};

module.exports = createVerificationNewEmailTemplate;
