//app.ts


import * as express from "express";
var app = express();
import * as db from "./db";

import InputController = require("./InputController");
app.use("/input", InputController);

export = app;