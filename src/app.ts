//app.ts


import express = require("express");

var app = express();
require("./db");

//Route setups
import InputController = require("./InputController");
app.use("/input", InputController);
/*import OutputController = require("./OutputController");
app.use("/output", OutputController);*/

export = app;