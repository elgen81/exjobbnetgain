import express = require("express");
var router = express.Router();
import bodyParser = require("body-parser");
import mongoose = require("mongoose");
import sorter = require("./sorter");
import { IMsgModel } from "./models/msg"
import { IDestinationListModel } from "./models/destinationList"
import repo = require("./dbRepository");

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