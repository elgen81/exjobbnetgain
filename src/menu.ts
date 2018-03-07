//menu.ts        
import whitelist = require('./whitelist')
import mongoose = require("mongoose")
import {IDestinationListModel} from "./models/destinationList"
import {IMsgModel} from "./models/msg"
import {IQueueListModel} from "./models/queueList"
import { DEFAULT_ENCODING } from 'crypto'
import { lookup } from 'dns'
import {errorController} from './logger'
import { readFileSync, writeFileSync, readFile, realpath } from 'fs'
import { create } from "domain"

const uri:string = "mongodb://127.0.0.1/my_db"

function convDate(sent:Date, received:Date){
   var time =  (sent.getTime() - received.getTime())
    var delta = Math.abs(time/1000)
    var days = Math.floor(delta/86400)
    delta-= days*86400
    var hours = Math.floor(delta/3600) %24
    delta-= hours*3600
    var minutes = Math.floor(delta/60)%60
    delta- minutes*60
    var seconds = delta % 60

    var timeString = ""
    if(days)
        timeString = timeString+"Days: "+days+", "
    if(hours)
        timeString = timeString+ " Hours: "+hours+", "
    if(minutes)
        timeString = timeString+ " Minutes: "+minutes+", "
    if(seconds)
        timeString = timeString+ " Seconds: "+seconds+", "

   return timeString 
}

switch(process.argv[2]){
    case'addWhite':
        if(process.argv.length>3){
            whitelist("add", process.argv[3])
        }
        else{
            errorController(process.argv[1], "please provide an adress for the output", "info", process.argv[2])
        }
    break
    case'dispWhite':
            whitelist("display",'')
    break
    case'remWhite':
        if(process.argv.length>3){
            whitelist("remove", process.argv[3])
        }
        else{
            errorController(process.argv[1], "Please provide an adress to be removed", "info", process.argv[2])
        }
    break
    case'display':

        mongoose.connect(uri, (err) => {
            if (err){
                errorController(process.argv[1], err, "error", process.argv[2])
            }
        })
        require("./models/destinationList");
        var DestList = mongoose.model("DestinationList")
        DestList.aggregate([
            {
               $lookup: {
                  from: "queuelists",
                  localField: "queueId",    // field in the orders collection
                  foreignField: "queueId",  // field in the items collection
                  as: "queues"
               }
            },
            { "$unwind": "$queues"},
            {"$project": {
                "queueId": 1,
                "destination" : 1
            }}
         ], function(err, query)
        {
            if (err){
                errorController(process.argv[1], err, "error", process.argv[2])
            }
            else {
                for(var i=0;i<query.length;i++){
                console.log(query[i].queueId+" : "+query[i].destination)
                }
            }
            mongoose.connection.close()
        } )
        console.log("Display the current active queues")   
    break
    case'history':
    mongoose.connect(uri, (err) => {
        if (err){
            errorController(process.argv[1], err, "error", process.argv[2])
        }
    })
    require("./models/msg")
    var msg = mongoose.model("Msg")
    msg.find({"isSent":true}, function(err, query: Array<IMsgModel>)
    {
        if (err){errorController(process.argv[1], err, "error", process.argv[2])}
        else {
            for(var i=0;i<query.length;i++){
            console.log("Time sent: "+query[i].timeSent.toString().slice(0,24)+" | "+ 
            "Time received: "+query[i].timeReceived.toString().slice(0,24)+" | "+
            "Receiver: "+query[i].receiver+" | "+
            "Sender: "+query[i].sender+" | "+
            "Time in queue: "+ convDate(query[i].timeSent, query[i].timeReceived))
            }
        }
        mongoose.connection.close()
    } )
        console.log("Display the queue history")
    break
    case'errorlog':
    const fs = require('fs')
    if(process.argv.length>3){
        const date = process.argv[3]
        var test = date.match(/\d\d\d\d-\d\d-\d\d/g)
        var path = require('path')
        if(test){
            fs.readFile("./errLog/log."+date,function(err,data){
                if(err){
                    errorController(process.argv[1], err, "error", process.argv[2])
                }
                else{
                console.log(data.toString())
                }
            })
        }
        else{
            errorController(process.argv[1], "Please provide a correct date yyyy-mm-dd to view", "info", process.argv[2])
        }
    }
    else{
        errorController(process.argv[1], "Please provide a correct date yyyy-mm-dd to view", "info", process.argv[2])
    }
    break
    case'restart':
        console.log("Restarting service")
    break
    case'shutdown':
        console.log("Saving queues and turning of system")
    break
    case'tupleId': 
        if(process.argv.length>3){
            whitelist("tupleId",process.argv[3])
        }
        else{
            errorController(process.argv[1], "Please provide an id for the tuple to be viewed", "info", process.argv[2])
        }
    break
    case'tupleName':
        if(process.argv.length>3){
            whitelist("tupleName",process.argv[3])
        }
        else{
            errorController(process.argv[1], "Please provide an id for the tuple to be viewed", "info", process.argv[2])
        }
    break
    case'tupleAll':
            whitelist("tupleAll",process.argv[3])
    break
    default:    
        console.log("Usage: node menu.js [options] [arguments]")
        console.log("")
        console.log("Options:")
        console.log("    addWhite [host:port]     For whitelisting outputs (ex. output 192.168.0.1:8000)")
        console.log("    remWhite [host:port]     Remove output from whitelist (ex. remove 192.168.1:8000)")
        console.log("    dispWhite                Displays the whitelist")
        console.log("    display                  Active queues")
        console.log("    history                  Display all history")
        console.log("    errorlog                 Displays the errorlog")
        console.log("    restart                  Restarts system")
        console.log("    shutdown                 Save all data and turn off system")
}