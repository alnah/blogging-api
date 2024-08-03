// @ts-nocheck
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const blake = require("blakejs");
const { ERROR_MESSAGES: ERR } = require("../constants");
const { hashPassword, hashToken } = require("../utils");
const {
  socialMediaValidator,
  emailValidator,
  urlValidator,
  avatarValidator,
} = require("../validators");

const AuthenticationUserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, ERR.USERNAME_REQUIRED],
    unique: true,
    maxlength: [50, "Username must be at most 50 characters long."],
  },

  email: {
    type: String,
    required: [true, ERR.EMAIL_REQUIRED],
    unique: true,
    validate: emailValidator,
  },

  password: {
    type: String,
    required: [true, ERR.PASSWORD_REQUIRED],
  },

  role: {
    type: String,
    enum: ["admin", "user"],
  },

  isVerified: {
    type: Boolean,
    default: false,
  },

  verificationToken: {
    type: String,
  },

  verificationDate: {
    type: Date,
  },

  resetPasswordToken: {
    type: String,
  },

  resetPasswordTokenExpirationDate: {
    type: Date,
  },
});

const SocialMediaSchema = new mongoose.Schema({
  facebook: {
    type: String,
    validate: socialMediaValidator.facebook,
  },

  instagram: {
    type: String,
    validate: socialMediaValidator.instagram,
  },

  tiktok: {
    type: String,
    validate: socialMediaValidator.tiktok,
  },

  x: {
    type: String,
    validate: socialMediaValidator.x,
  },

  linkedin: {
    type: String,
    validate: socialMediaValidator.linkedin,
  },
});

const UserSchema = new mongoose.Schema(
  {
    ...AuthenticationUserSchema.obj,

    bio: {
      type: String,
      maxLength: [500, "Bio must be at most 500 characters long."],
    },

    avatar: {
      type: String,
      validate: avatarValidator,
    },

    location: {
      type: String,
      maxlength: [50, "Location must be at most 50 characters long."],
    },

    website: {
      type: String,
      validate: urlValidator,
    },

    socialMedia: {
      type: SocialMediaSchema,
    },
  },

  { timestamps: true }
);

UserSchema.pre("save", async function () {
  // Hash password
  const isModifiedPassword = this.isModified("password");

  if (isModifiedPassword) {
    const hashedPassword = await hashPassword({ password: this.password });
    this.set({ password: hashedPassword });
  }

  // Hash verificationToken
  const isModifiedVerificationToken = this.isModified("verificationToken");
  const notNullToken = this.verificationToken !== null;

  if (isModifiedVerificationToken && notNullToken) {
    const hashedVerificationToken = await hashToken({
      token: this.verificationToken,
    });
    this.set({ verificationToken: hashedVerificationToken });
  }
});

UserSchema.pre("updateOne", async function () {
  // Hash password
  const isUpdated = this.getUpdate();

  if (isUpdated.password) {
    const hashedPassword = await hashPassword({ password: isUpdated.password });
    this.set({ password: hashedPassword });
  }

  // Hash resetPasswordToken
  const notNullToken = isUpdated.resetPasswordToken !== null;

  if (isUpdated.resetPasswordToken && notNullToken) {
    const hashedResetPasswordToken = await hashToken({
      token: isUpdated.resetPasswordToken,
    });

    this.setUpdate({
      resetPasswordToken: hashedResetPasswordToken,
      resetPasswordTokenExpirationDate:
        Date.now() + Number(process.env.RESET_PASSWORD_TOKEN_LIFETIME),
    });
  }
});

UserSchema.methods.verifyPasswordsMatch = async function ({ password }) {
  return await bcrypt.compare(password, this.password);
};

module.exports = mongoose.model("User", UserSchema);
