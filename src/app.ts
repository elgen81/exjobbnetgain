//app.ts


import * as express from "express";
var app:express = express();
import * as db from "./db";

import UserController = require("./UserController");
app.use("/users", UserController);

export = app;