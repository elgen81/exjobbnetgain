//UserController.ts

import express = require("express");
var router = express.Router();
import bodyParser = require("body-parser");
import mongoose = require("mongoose");
import sorter = require("./sorter");
import { IDestinationListModel } from "./models/destinationList"
import { IMsgModel } from "./models/msg"
import { IQueueListModel } from "./models/queueList"
import * as repo from "./dbRepository";
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
	console.log(req.body)
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
				msg: req.body
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
export = router;