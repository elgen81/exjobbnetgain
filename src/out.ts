
import { outputer } from "./outputer"
import events = require("events");
import * as mongoose from "mongoose";
import repo = require("./dbRepository");
import {logController} from './logger';
import { config } from "./_config";

/*var queueId;
process.on("message", (dest) => {
	queueId = dest
})
*/
const queuId = +process.argv[2]
const eventEmitter = new events.EventEmitter()
const Out = new outputer(Number(process.argv[2]), eventEmitter);


eventEmitter.on("sendNext", () =>{
	Out.startSend();
})

eventEmitter.on("done", () =>{
	console.log("Is done");
	process.send({msg: "outDone", id: queuId})
})

console.log(config.mongoURI["development"])
var uri:string = config.mongoURI["development"]
mongoose.connect(uri, (err) => {
  if (err) {
    logController(process.argv[1], err, "error", "Connection MongoDb")
  }
  else {
    logController(process.argv[1], "Connected to MongoDb", "info", "Connection MongoDb")

  }
});

//Init database models
require("./models/destinationList");
require("./models/msg");
require("./models/queueList");


eventEmitter.emit("sendNext");
