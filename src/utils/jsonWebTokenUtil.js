const jwt = require("jsonwebtoken");

const createJsonWebToken = ({ payload }) => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_LIFETIME,
  });
};

const verifyJsonWebToken = ({ token }) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

module.exports = { createJsonWebToken, verifyJsonWebToken };
