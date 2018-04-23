import express = require("express");
var router = express.Router();
import bodyParser = require("body-parser");
import mongoose = require("mongoose");
import sorter = require("./sorter");
import { IMsgModel } from "./models/msg"
import { IDestinationListModel } from "./models/destinationList"
import repo = require("./dbRepository");
import { IQueueListModel } from "./models/queueList"
import { logController} from "./logger"


var Msg = mongoose.model("Msg");
var DestList = mongoose.model("DestinationList")
router.use(bodyParser.urlencoded({ extended: true }));

router.get('/', function(req, res){

	var msgRet = repo.queuePop(req.body.dest, function(err, msgId){
		Msg.findOne({ _id: msgId }, function(err, msg){
			console.log(msg)
			res.status(200).send(msg)
		})
	})
	console.log(msgRet);
})

router.post('/', function(req, res){})


interface ICallbackB{
	( error: Error, staus:boolean ) :void
}

router.get('/:dest', function(req, res){
	console.log("in get")
	out(req.params.dest, res);
});

function out(dest:number, res){
	console.log("in out()")
	sendOut(dest, res, function(err, status){
		if(err){
			logController(process.argv[1], err, 'error', "Out")
		} 
		else if( status){
			console.log("pre recursive call"); 
			out(dest, res);
		} 
	})
}

function sendOut(dest:number, res, cb:ICallbackB){
	var q = mongoose.model("QueueList")
	var msg = mongoose.model("Msg")

	repo.queuePop(dest, function(err, queue:IQueueListModel){
		if(err) throw err

		msg.findOne({_id: queue.lastSentMsg}, function(err, msgToSend:IMsgModel){
			if(err){
				logController(process.argv[1], err , 'error', "sendOut")
			} 
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

export = router