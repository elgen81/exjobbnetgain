//db.ts

import * as mongoose from "mongoose";
import repo = require("./dbRepository");

//DATABASE CONNECTION
var uri:string = "mongodb://127.0.0.1/my_db";

mongoose.connect(uri, (err) => {
  if (err) {
    console.log(err.message);
    console.log(err);
  }
  else {
    console.log('Connected to MongoDb');
  }
});

// CONNECTION EVENTS
// When successfully connected
mongoose.connection.on('connected', function () {  
  console.log('Mongoose default connection open to ' + uri);
}); 

// If the connection throws an error
mongoose.connection.on('error',function (err) {  
  console.log('Mongoose default connection error: ' + err);
}); 

// When the connection is disconnected
mongoose.connection.on('disconnected', function () {  
  console.log('Mongoose default connection disconnected'); 
});

// If the Node process ends, close the Mongoose connection 
process.on('SIGINT', function() {  
  mongoose.connection.close(function () { 
    console.log('Mongoose default connection disconnected through app termination'); 
    process.exit(0); 
  }); 
});

//Init database models
require("./models/destinationList");
require("./models/msg");
require("./models/queueList");

//Instantiate DestinationList collection to represent whitelist.ini
repo.destinationListSetup();