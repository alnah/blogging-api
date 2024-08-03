const bcrypt = require("bcryptjs");
const blake = require("blakejs");

const hashPassword = async function ({ password }) {
  const roundsOfSalt = Number(process.env.ROUNDS_OF_SALT);
  const salt = await bcrypt.genSalt(roundsOfSalt);
  return await bcrypt.hash(password, salt);
};

const hashToken = async function ({ token }) {
  return blake.blake2bHex(token);
};

module.exports = { hashPassword, hashToken };
