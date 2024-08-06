const fileUpload = require("express-fileupload");

const fileUploader = () => {
  return fileUpload();
};

module.exports = fileUploader;
