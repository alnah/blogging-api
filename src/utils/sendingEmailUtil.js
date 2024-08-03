const nodemailer = require("nodemailer");
const {
  createVerificationEmailTemplate,
  createResetPasswordEmailTemplate,
} = require("../templates");

const _sendEmail = async ({ to, subject, html }) => {
  let configMailer, transporter, from;

  if (process.env.NODE_ENV === "development") {
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
    //TODO: Implement the actual email provider for production use here.
    return;
  }

  return transporter.sendMail({
    from,
    to,
    subject,
    html,
  });
};

const sendVerificationEmail = async ({
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

module.exports = { sendVerificationEmail, sendResetPasswordEmail };
