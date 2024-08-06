const SELECT_FIELDS = {
  EXC: {
    PASSWORD: "-password",
    SENSITIVE:
      "-verificationToken -resetPasswordToken " +
      "-resetPasswordTokenExpirationDate -password -updatedAt -__v",
  },
  INC: {
    PASSWORD: "password",
  },
};

module.exports = SELECT_FIELDS;
