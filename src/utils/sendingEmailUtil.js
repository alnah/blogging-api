const nodemailer = require("nodemailer");
const { ENVIRONMENT: ENV } = require("../constants");
const {
  createVerificationEmailTemplate,
  createResetPasswordEmailTemplate,
  createVerificationNewEmailTemplate,
} = require("../templates");

const _sendEmail = async ({ to, subject, html }) => {
  let configMailer;
  let transporter;
  let from;

  if (ENV.IS_DEV) {
    await nodemailer.createTestAccount();

    configMailer = {
      host: process.env.NODEMAILER_HOST,
      port: Number(process.env.NODEMAILER_PORT),
      auth: {
        user: process.env.NODEMAILER_USER,
        pass: process.env.NODEMAILER_PASSWORD,
      },
    };

    transporter = nodemailer.createTransport(configMailer);
    from = process.env.NODEMAILER_FROM;
  } else {
    // TODO: Implement the actual email provider for production use here.
    return;
  }

  transporter.sendMail({
    from,
    to,
    subject,
    html,
  });
};

const sendEmailVerification = async ({
  origin,
  verificationToken,
  email,
  username,
}) => {
  const verificationEmailTemplate = createVerificationEmailTemplate({
    origin,
    verificationToken,
    email,
    username,
  });
  return _sendEmail(verificationEmailTemplate);
};

const sendNewEmailVerification = async ({
  origin,
  verificationToken,
  email,
  username,
}) => {
  const verificationEmailTemplate = createVerificationNewEmailTemplate({
    origin,
    verificationToken,
    email,
    username,
  });
  return _sendEmail(verificationEmailTemplate);
};

const sendResetPasswordEmail = async ({
  origin,
  resetPasswordToken,
  email,
  username,
}) => {
  const resetPasswordEmailTemplate = createResetPasswordEmailTemplate({
    origin,
    resetPasswordToken,
    email,
    username,
  });
  return _sendEmail(resetPasswordEmailTemplate);
};

module.exports = {
  sendEmailVerification,
  sendNewEmailVerification,
  sendResetPasswordEmail,
};
