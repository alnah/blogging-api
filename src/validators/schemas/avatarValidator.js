const avatarValidator = {
  validator: (v) => v.startsWith("./src/uploads/avatars/"),
  message: (props) =>
    `${props.value} is not a valid avatar path. It should start with ` +
    "./src/uploads/avatars/",
};

module.exports = avatarValidator;
