const express = require('express');

const rootMiddleware = app => {
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
};

module.exports = rootMiddleware;
