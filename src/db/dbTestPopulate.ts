//

import mongoose = require("mongoose");
import { waterfall } from "async"
require("../db");

var DestinationList = mongoose.model("DestinationList");
var Msg = mongoose.model("Msg");
var QueueList = mongoose.model("QueueList");
var isDone:number = 0;
var Dest;

waterfall([
		function(next){
			DestinationList.remove({})
		},
		function(next){
			DestinationList.remove({})
		},
		function(next){
			Msg.remove({})
		},
		function(next){
			QueueList.remove({})
		},
		function(){
			DestinationList.create({
				queueID: 0,
				destination: "Dest0",
				active: true
			})
		},
		function(){
			DestinationList.create({
				queueID: 1,
				destination: "Dest1",
				active: false
			})
		},
		function(){
			DestinationList.find({queueID: 0}, function(err, dest){
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
			})
		},
		function(){
			Msg.find({}, function(err, msg){
				QueueList.update(
					{ queueID: Dest[0]._id },
					{ $push: { msgArray: { $each: msg }}
				})
				QueueList.update(
					{ queueID: Dest[0]._id },
					{ $inc: { lengthOfQueue: 2}
				});
				});
		},
		function(){
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
			})
		}

	], function(err){
		if(err)
			{	console.log("there was an error"); process.exit(0);}
		else
		{
			console.log(isDone)
			console.log("Poplation complete")
			process.exit(0);
		}
	})

