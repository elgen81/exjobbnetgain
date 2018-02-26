//UserController.ts

import express = require("express");
var router = express.Router();
import bodyParser = require("body-parser");
import mongoose = require("mongoose");
import sorter = require("./sorter");
import { IMsgModel } from "./models/msg"
import { IDestinationListModel } from "./models/destinationList"

var Msg = mongoose.model("Msg");
var DestList = mongoose.model("DestinationList")
router.use(bodyParser.urlencoded({ extended: true }));
//router.use(bodyParser.json());

router.post('/', function(req, res){
	
	
	console.log(req.body.reciver);
	console.log(req.body.msg);
	//console.log(msgIn);
	DestList.find({ destination : req.body.reciver}, function(err, dest:Array<IDestinationListModel>){

		if(dest.length > 0){
			console.log(dest[0].queueId)
			var msgIn:mongoose.Document = new Msg({
				queueId: dest[0].queueId,
				sender: req.connection.remoteAddress,
				reciver: req.body.reciver,
				timeRecived: new Date(),
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
					sorter.sortElem(msg._id);
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

router.get('/', function(req, res){
	Msg.find({}, function(err, msg){
		if(err) {return res.status(500).send("There was a problem finding the users.");}
		res.status(200).send(msg);
	});
});

export = router;