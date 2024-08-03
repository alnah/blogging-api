const mongoose = require("mongoose");
const { ERROR_MESSAGES: ERR } = require("../constants");

const TokenSchema = new mongoose.Schema(
  {
    refreshToken: {
      type: String,
      required: [true, ERR.REFRESH_TOKEN_REQUIRED],
    },
    ipAddress: {
      type: String,
      required: [true, ERR.IP_ADDRESS_REQUIRED],
    },
    userAgent: {
      type: String,
      required: [true, ERR.USER_AGENT_REQUIRED],
    },
    isValid: {
      type: Boolean,
      default: true,
    },
    userId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: [true, ERR.USER_REFERENCE_REQUIRED],
    },
  },
  { timestamps: true }
);

TokenSchema.statics.createUserRef = ({ existingUser }) => {
  return {
    id: existingUser._id,
    username: existingUser.username,
    role: existingUser.role,
  };
};

module.exports = mongoose.model("Token", TokenSchema);
