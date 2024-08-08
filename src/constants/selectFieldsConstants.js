const SELECT_FIELDS = {
  EXC: {
    VERSION: "-__v",
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
