// @ts-nocheck
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const blake = require("blakejs");
const { ENVIRONMENT: ENV, ERROR_MESSAGES: ERR } = require("../constants");
const { hashPassword, hashToken } = require("../utils");
const {
  socialMediaValidator,
  emailValidator,
  urlValidator,
  serverPathValidator,
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

const UserProfileSchema = new mongoose.Schema({
  bio: {
    type: String,
    maxLength: [500, "Bio must be at most 500 characters long."],
  },

  location: {
    type: String,
    maxlength: [50, "Location must be at most 50 characters long."],
  },

  website: {
    type: String,
    validate: urlValidator,
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
    ...UserProfileSchema.obj,
    ...SocialMediaSchema.obj,

    userUrl: {
      type: String,
      validate: serverPathValidator,
    },

    avatarUrl: {
      type: String,
      validate: serverPathValidator,
    },

    posts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
      },
    ],
  },

  { timestamps: true }
);

UserSchema.pre("save", async function () {
  // Create userURL
  const isModifiedUsername = this.isModified("username");
  if (isModifiedUsername) {
    this.set({
      userUrl:
        ENV.IS_DEV || ENV.IS_TEST
          ? `${process.env.ORIGIN_DEV}/@${this.username}`
          : `${process.env.ORIGIN_PROD}/@${this.username}`,
    });
  }

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
  const update = this.getUpdate();
  if (update.password) {
    const hashedPassword = await hashPassword({ password: update.password });
    this.set({ password: hashedPassword });
  }

  // Hash resetPasswordToken
  const notNullToken = update.resetPasswordToken !== null;
  if (update.resetPasswordToken && notNullToken) {
    const hashedResetPasswordToken = await hashToken({
      token: update.resetPasswordToken,
    });

    this.setUpdate({
      resetPasswordToken: hashedResetPasswordToken,
      resetPasswordTokenExpirationDate:
        Date.now() + Number(process.env.RESET_PASSWORD_TOKEN_LIFETIME),
    });
  }
});

UserSchema.pre("findOneAndUpdate", async function () {
  const update = this.getUpdate();
  // Update userUrl
  if (update.username) {
    this.set({
      userUrl:
        ENV.IS_DEV || ENV.IS_TEST
          ? `${process.env.ORIGIN_DEV}/@${update.username}/profile`
          : `${process.env.ORIGIN_PROD}/@${update.username}/profile`,

      avatarUrl:
        ENV.IS_DEV || ENV.IS_TEST
          ? `${process.env.ORIGIN_DEV}/@${update.username}/avatar`
          : `${process.env.ORIGIN_PROD}/@${update.username}/avatar`,
    });
  }

  // Hash verificationToken keep new updated email
  const notNullToken = update.verificationToken !== null;
  if (update.verificationToken && notNullToken) {
    const hashedVerificationToken = await hashToken({
      token: update.verificationToken,
    });
    this.setUpdate({ ...update, verificationToken: hashedVerificationToken });
  }
});

UserSchema.statics.getFieldsForUpdate = () => {
  const getFilteredFields = (schema) =>
    Object.keys(schema.paths).filter(
      (field) => field !== "__v" && field !== "_id"
    );
  return [
    ...getFilteredFields(UserProfileSchema),
    ...getFilteredFields(SocialMediaSchema),
  ];
};

UserSchema.methods.verifyPasswordsMatch = async function ({ password }) {
  return bcrypt.compare(password, this.password);
};

module.exports = mongoose.model("User", UserSchema);
