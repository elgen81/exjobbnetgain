//UserController.ts

import express = require("express");
var router = express.Router();
import bodyParser = require("body-parser");
import mongoose = require("mongoose");
import sorter = require("./sorter");

var Msg = mongoose.model("Msg");
router.use(bodyParser.urlencoded({ extended: true }));
//router.use(bodyParser.json());

router.post('/', function(req, res){
	
	var msgIn = new Msg({
		sender: req.connection.remoteAddress,
		reciver: req.body.reciver,
		timeRecived: Date.now,
		isSorted: false,
		isSent: false,
		msg: req.body.msg
	});
	console.log(req.body.reciver);
	console.log(req.body.msg);
	console.log(msgIn);
	msgIn.save(function(err, msg){
		//res.send("hello wolrd!")
		if(err) 
			{return res.status(500).send("There was a problem adding the information to the database.");}
		else
		{
			sorter.sortElem(msg._id);
			res.status(200).send("Information added to the database.");
		}
	});
});

router.get('/', function(req, res){
	Msg.find({}, function(err, msg){
		if(err) {return res.status(500).send("There was a problem finding the users.");}
		res.status(200).send(msg);
	});
});

export = router;