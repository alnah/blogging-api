const express = require("express");
const _cookieParser = require("cookie-parser");

const jsonParser = () => {
  return express.json();
};

const cookieParser = () => {
  return _cookieParser(process.env.JWT_SECRET);
};

module.exports = { jsonParser, cookieParser };
