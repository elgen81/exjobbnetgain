import express = require("express");
import bodyParser = require("body-parser");
import mongoose = require("mongoose");
import sorter = require("./sorter");
import { IMsgModel } from "./models/msg"
import { IDestinationListModel } from "./models/destinationList"
import { IQueueListModel } from "./models/queueList"
import repo = require("./dbRepository");
import {logController} from "./logger"
import {appendLine, removeLine, fileToString} from "./file"
import {eventEmitter} from './ESB'

var response
var router = express.Router();
router.use(bodyParser.urlencoded({ extended: true }));

router.get('/getStatus', function(req, res){
    res.status(200).json({Server: 'OK', DBStatus: mongoose.connection.readyState})
})

router.get('/listActive', function(req,res){
    repo.listActive(function(err,listActive){
        if(err){
            req.body = "Nothing in queue";
        }
        else{
            req.body = listActive;
        }
        res.status(200).send(req.body)
    })
    
})
router.get('/whitelistini', function(req,res){
    var adress = (process.argv[1]).slice(0, process.argv[1].lastIndexOf("/")+1)
    fileToString(adress+"../whitelist.ini",function(err,whitelist){
        if(err){
            res.status(500).send(err.message);
        }
        else{
            res.status(200).send(whitelist);
        }
    })
    
})

router.get('/servDbStatus', function(req,res){
    req.body.statusS = mongoose.connection.readyState.toString();
    if(req.body.statusS != '0'){
        repo.activeQueues(function(err,activeQueues){
            if(err){
                req.body.statusQ = "N/A";
            }
            else{
                req.body.statusQ = activeQueues;
            }
            repo.activeMsg(function(err,activMsg){
                if(err){
                    req.body.statusQ = "N/A";
                }
                else{
                    req.body.statusP = activMsg;
                    
                }
            res.status(200).send(req.body)
            })
        })
    }
    else{
        req.body.statusP="N/A";
        req.body.statusQ="N/A";
        req.body.statusS="N/A";
        res.status(500).send(req.body);
    }
})

router.post('/errorLog', function(req,res){
    var adress = (process.argv[1]).slice(0, process.argv[1].lastIndexOf("/")+1) 
    logController(process.argv[1], "Sent to errorlog"+req.body, 'info')
    fileToString(adress+"../errLog/"+"errlog."+req.body.date, function(err,status){
        if(!err){
            res.status(200).send(status)
        }
        else{
            res.status(500).send(err.message)  
        }    
    })
})

router.post('/Log', function(req,res){
    var adress = (process.argv[1]).slice(0, process.argv[1].lastIndexOf("/")+1) 
    logController(process.argv[1], "Sent to errorlog"+req.body, 'info')
    fileToString(adress+"../log/"+"log."+req.body.date, function(err,status){
        if(!err){
            res.status(200).send(status)
        }
        else{
            res.status(500).send(err.message)  
        }    
    })
})

router.post('/whitelist', function(req,res){
    logController(process.argv[1],req.body,'info')

    if(req.body.button == "Add"){
        appendLine("whitelist.ini", req.body.adress,function(err,status){
            if(status){
                res.status(200).send(req.body.adress+" added")
            } 
            else{
                res.status(500).send(err.message)
            }  
        })   
    }
    else if(req.body.button == "Remove"){
        removeLine("whitelist.ini",req.body.adress,function(err, status){
            if(status){
                res.status(200).send(req.body.adress+" removed")
            }
            else{
                res.status(500).send(err.message)
            }    
        })
    }
    else{
        res.status(400).send("Server error")
    }
});

router.post('/shutdown', function(req, res){
    if(req.connection.remoteAddress){
        mongoose.connection.close(function(err:Error){
            if(err){
                logController(process.argv[1], err, "error")
                res.status(500).send("Error shutting down")
            }
            else{
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

router.post('/startup', function(req, res){
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