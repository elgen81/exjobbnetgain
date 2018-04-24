//UserController.ts

import express = require("express");
var router = express.Router();
import bodyParser = require("body-parser");
import mongoose = require("mongoose");
import sorter = require("./sorter");
import { IDestinationListModel } from "./models/destinationList"
import { IMsgModel } from "./models/msg"
import { IQueueListModel } from "./models/queueList"
import repo = require("./dbRepository");
import outer = require("./outputer");
import events = require("events")

var eventEmitter = new events.EventEmitter()

var Msg = mongoose.model("Msg");
var DestList = mongoose.model("DestinationList")
router.use(bodyParser.urlencoded({ extended: true }));
//router.use(bodyParser.json());

router.post('/', function(req, res){
	
	console.log(req.body.receiver);
	console.log(req.body.msg);
	//console.log(msgIn);
	DestList.findOne({ destination : req.body.receiver}, function(err, dest:IDestinationListModel){

		if(dest && dest.active){
			console.log(dest.queueId)
			var msgIn:mongoose.Document = new Msg({
				queueId: dest.queueId,
				sender: req.connection.remoteAddress,
				receiver: req.body.receiver,
				timeReceived: new Date(),
				isSorted: false,
				isSent: false,
				msg: req.body.msg
			});
			msgIn.populate(function(){});
			msgIn.save(function(err, msg){
				//res.send("hello wolrd!")
				if(err) 
					{return res.status(500).send("There was a problem adding the information to the database." + err);}
				else
				{
					sorter.sortElem(msg._id, function(err, status){
						if(err) 
							{throw err;}
						else
							{ process.send({msg: 'newOut', id: dest.queueId}) }
					});
					res.status(200).send("Information added to the database.");
				}
			});
		}
		else{
			if(err) { res.status(500).send("There was a problem retriving the destination.") }
			else { res.status(500).send("Unknown Destination.") }
		}
	}).limit(1);
});
/*
router.get('/:dest', function(req, res){
	console.log("in get")
	outer.out(req.params.dest, res);
});
*/
router.get('/display', function(req, res){
	//if(req.connection.remoteAddress == "1")
		//{
		 //process.send('display');
		 //eventEmitter.emit('display')
		 //res.status(200).send("OK"); 
		 //}
		 res.render('../views/index.html')
})


/*router.get('/:dest', function(req, res){
	console.log(req.params.dest)
	repo.queuePop(req.params.dest, function(err, queue:IQueueListModel){
		console.log("msgId: "+ queue.lastSentMsg)
		if(err){ console.log("In QueuePop(): "+err); res.status(500).send("Error getting message: " + err)}
		Msg.findById(queue.lastSentMsg, function(err, msg:IMsgModel){
			if(err){ console.log("In Msg.Find(): "+err); res.status(404).send("Error getting message: " + err) }
			if(msg){
				console.log(msg)
				res.status(200).send(msg)
				msg.isSent = true;
				msg.save(function(err){
					queue.timeOfLastSent = new Date();
				})
			}
			else{ res.status(200).send("No messages to send")}	
			})
	})
});*/

export = router;