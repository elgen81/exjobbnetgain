import express = require("express");
import bodyParser = require("body-parser");
import mongoose = require("mongoose");
import sorter = require("./sorter");
import { IMsgModel } from "./models/msg"
import { IDestinationListModel } from "./models/destinationList"
import { IQueueListModel } from "./models/queueList"
import repo = require("./dbRepository");
import {logController} from "./logger"

var router = express.Router();
var Msg = mongoose.model("Msg");
var DestList = mongoose.model("DestinationList")
var Queue = mongoose.model("QueueList")
router.use(bodyParser.urlencoded({ extended: true }));

router.get('/getStatus', function(req, res){
        res.status(200).json({Server: 'OK', DBStatus: mongoose.connection.readyState})
})

router.post('/shutdown', function(req, res){
    if(req.connection.remoteAddress){
        mongoose.connection.close(function(err:Error){
            if(err){
                console.log("got here")
                logController(process.argv[1], err, "error")
                res.status(500).send("Error shutting down")
            }
            else{
                console.log("Got herer")
                res.status(200).send()
                process.kill(process.pid, "SIGTERM")
            }
        })
    }
    else{
        console.log("Nemas Problemas")
        res.status(500).send("You are not supposeed to be here lurking")
    }
})
export = router