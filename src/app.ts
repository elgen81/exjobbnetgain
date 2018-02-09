//app.ts


import express = require("express");
var app = express();
var db = require("./db");


import InputController = require("./InputController");
app.use("/input", InputController);

export = app;