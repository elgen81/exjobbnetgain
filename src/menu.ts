//menu.ts        
import whitelist = require('./whitelist')
import mongoose = require("mongoose");
import {IDestinationListModel} from "./models/destinationList"
import {IQueueListModel} from "./models/queueList"
import { DEFAULT_ENCODING } from 'crypto';
import { lookup } from 'dns';
    
switch(process.argv[2]){
    case'addWhite':
        if(process.argv.length>3){
            whitelist("add", process.argv[3])
        }
        else{
            console.log("please provide an adress for the output")
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
            console.log("please provide an adress for the adress to be removed")
        }
    break
    case'display':
        require("./db")
        var Queue = mongoose.model("QueueList")
        var DestList = mongoose.model("DestinationList")
        Queue.find({},function(err, queue : Array  <IQueueListModel>){
            if (err) console.log(err)
            console.log("IT STARTS HERE")
            for(var i=0; i< queue.length;i++){
                DestList.findOne({queueId:queue[i].queueId}, function(err, lists: IDestinationListModel){
                    if(err) console.log(err)
                console.log(lists.queueId+": "+lists.destination)
                })
            }
            //console.log(lists[0])
        })
        console.log("Display the current active queues")   
    break
    case'history':
        console.log("Display the queue history")
    break
    case'errorlog':
        console.log("Displaying errorlog")
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
            console.log("please provide an id for the tuple to be viewed")
        }
    break
    case'tupleName':
        if(process.argv.length>3){
            whitelist("tupleName",process.argv[3])
        }
        else{
            console.log("please provide an adress for the tuple to be viewed")
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