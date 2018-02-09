"use strict";
//app.ts
var express = require("express");
var app = express();
var db = require("./db");
var InputController = require("./InputController");
app.use("/input", InputController);
module.exports = app;
