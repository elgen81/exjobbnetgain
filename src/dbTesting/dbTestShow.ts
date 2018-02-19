import mongoose = require("mongoose");
require("../db");

var DestinationList = mongoose.model("DestinationList");
var Msg = mongoose.model("Msg");
var QueueList = mongoose.model("QueueList");


DestinationList.find({}, function(err, dests){
	if(err) { console.log(err) }
	else { console.log(dests); }
})


Msg.find({}, function(err, msgs){
	if(err) { console.log(err) }
	else { console.log(msgs); }
})


QueueList.find({}, function(err, queues){
	if(err) { console.log(err) }
	else { console.log(queues); }
})