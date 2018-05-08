//db.ts

import * as mongoose from "mongoose";
import repo = require("./dbRepository");
import {logController} from './logger';
import { config } from "./_config";
import app = require("./app")
//DATABASE CONNECTION
var uri:string = "mongodb://127.0.0.1/my_db";
//console.log(process.env)
//var uri:string = config.mongoURI[app.settings.env]
mongoose.connect(uri, (err) => {
  if (err) {
    logController(process.argv[1], err, "error", "Connection MongoDb")
  }
  else {
    logController(process.argv[1], "Connected to MongoDb", "info", "Connection MongoDb")

  }
});

// CONNECTION EVENTS
// When successfully connected
mongoose.connection.on('connected', function () {
  logController(process.argv[1], "Mongoose default connection open to " + uri, "info", "Connection success Mongoose")  
});

// If the connection throws an error
mongoose.connection.on('error',function (err) {
  logController(process.argv[1], "Mongoose default connection error: " + err, "error", "Connecting to mongoose")    
}); 

// When the connection is disconnected
mongoose.connection.on('disconnected', function () {
  logController(process.argv[1], 'Mongoose default connection disconnected', 'info')   
});

// If the Node process ends, close the Mongoose connection 
process.on('SIGINT', function() {  
  mongoose.connection.close(function () {
    logController(process.argv[1], 'Mongoose default connection disconnected through app termination', 'info')   
    process.exit(0); 
  }); 
});

//Init database models
require("./models/destinationList");
require("./models/msg");
require("./models/queueList");

//Instantiate DestinationList collection to represent whitelist.ini
repo.destinationListSetup("whitelist.ini");