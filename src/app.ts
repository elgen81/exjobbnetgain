//app.ts


import express = require("express");
var app = express();
var db = require("./db");


//Route setups
import InputController = require("./InputController");
app.use("/input", InputController);



export = app;