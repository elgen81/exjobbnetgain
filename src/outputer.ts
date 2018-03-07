
import express = require("express");
var router = express.Router();
import bodyParser = require("body-parser");
import mongoose = require("mongoose");
import sorter = require("./sorter");
import { IDestinationListModel } from "./models/destinationList"
import { IMsgModel } from "./models/msg"
import { IQueueListModel } from "./models/queueList"
import repo = require("./dbRepository");

interface ICallbackB{
	( error: Error, staus:boolean ) :void
}

export function out(dest:number, res){
	console.log("in out()")
	sendOut(dest, res, function(err, status){
		if(err) throw err;
		else if( status){ console.log("pre recursive call"); out(dest, res);} 
	})
}

function sendOut(dest:number, res, cb:ICallbackB){
	var q = mongoose.model("QueueList")
	var msg = mongoose.model("Msg")

	repo.queuePop(dest, function(err, queue:IQueueListModel){
		if(err) throw err

		msg.findOne({_id: queue.lastSentMsg}, function(err, msgToSend:IMsgModel){
			if(err) throw err;
			console.log("in send")
			console.log(queue.lengthOfQueue)
			//res.send(msgToSend)
			if(queue.lengthOfQueue > 0){
				cb(null, true)
			}
			else{
				cb(null, false)
			}
			
		})
	})
}