const mongoose = require("mongoose");

const TokenSchema = new mongoose.Schema(
  {
    refreshToken: {
      type: String,
      required: [
        true,
        "Refresh token is required. Please provide a refresh token.",
      ],
    },
    ipAddress: {
      type: String,
      required: [true, "IP address is required. Please provide an IP address."],
    },
    userAgent: {
      type: String,
      required: [true, "User agent is required. Please provide a user agent."],
    },
    isValid: {
      type: Boolean,
      default: true,
    },
    userId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: [
        true,
        "User reference is required. Please provide a user reference.",
      ],
    },
  },
  { timestamps: true },
);

TokenSchema.statics.createUserRef = ({ existingUser }) => {
  return {
    id: existingUser._id,
    username: existingUser.username,
    role: existingUser.role,
  };
};

module.exports = mongoose.model("Token", TokenSchema);
