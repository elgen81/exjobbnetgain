import express = require("express");
import bodyParser = require("body-parser");
import mongoose = require("mongoose");
import sorter = require("./sorter");
import { IMsgModel } from "./models/msg"
import { IDestinationListModel } from "./models/destinationList"
import { IQueueListModel } from "./models/queueList"
import repo = require("./dbRepository");

var router = express.Router();
var Msg = mongoose.model("Msg");
var DestList = mongoose.model("DestinationList")
var Queue = mongoose.model("QueueList")
router.use(bodyParser.urlencoded({ extended: true }));

router.get('/', function(req, res){

	
})

router.post('/', function(req, res){
	
})

export = router