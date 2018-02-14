//

import mongoose = require("mongoose");
require("../db");

var DestinationList = mongoose.model("DestinationList");
var Msg = mongoose.model("Msg");
var QueueList = mongoose.model("QueueList");

DestinationList.create({
	queueID: 0,
	destination: "Dest0",
	active: true
}, function(err,dest){
	console.log("First msg added. (err = " + err + ')');
});
DestinationList.create({
	queueID: 1,
	destination: "Dest1",
	active: false
}, function(err, dest){
	console.log("Last dest added. (err = " + err + ')');
});

var Dest;
DestinationList.find({queueID: 1}, function(err, dest){
	Msg.create({
		queueId: dest[0]._id,
		sender: "me",
		reciver: "you",
		isSent: false,
		isSorted: true,
		timeRecived: Date.now(),
		timeSent: null,
		msg: "Hello"
	});
	Msg.create({
		queueId: dest[0]._id,
		sender: "somebody",
		reciver: "everybody",
		isSent: true,
		isSorted: true,
		timeRecived: Date.now(),
		timeSent: Date.now(),
		msg: "needs"
	});
	QueueList.create({
		queueID: dest[0]._id,
		lengthOfQueue: 0
	});
	Dest = dest;
	console.log("First msgs added. (err = " + err + ')');
})

Msg.find({}, function(err, msg){
	QueueList.update(
		{ queueID: Dest[0]._id },
		{ $push: { msgArray: { $each: msg }}
	})
	QueueList.update(
		{ queueID: Dest[0]._id },
		{ $inc: { lengthOfQueue: 2}
	});
	console.log("Queue added. (err = " + err + ')');
});

DestinationList.find({queueID: 0}, function(err, dest){
	Msg.create({
		queueId: dest[0]._id,
		sender: "Dest0",
		reciver: "me",
		isSent: false,
		isSorted: false,
		timeRecived: Date.now(),
		timeSent: null,
		msg: "foo"
	});
	console.log("Last msg added. (err = " + err + ')');
})

console.log("Poplation complete")