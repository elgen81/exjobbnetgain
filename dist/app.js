"use strict";
//app.ts
var express = require("express");
var app = express();
var UserController = require("./UserController");
app.use("/users", UserController);
module.exports = app;
