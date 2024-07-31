const express = require("express");

const jsonParserMiddleware = () => {
  return express.json();
};

module.exports = jsonParserMiddleware;
