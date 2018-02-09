"use strict";
//app.ts
var express = require("express");
var app = express();
var InputController = require("./InputController");
app.use("/input", InputController);
module.exports = app;
